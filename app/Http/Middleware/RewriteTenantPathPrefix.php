<?php

namespace App\Http\Middleware;

use App\Models\Domain;
use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;

/**
 * An agency's whole site — every page, every API call — works under
 * /{slug}/... the same way it works under a real subdomain, with nothing
 * duplicated or rewritten by hand per route:
 *
 * 1. /{slug}/anything strips the prefix and routes exactly like /anything
 *    (see the class-level note below), and remembers the slug in a
 *    long-lived cookie — independent of the PHP session, so it isn't
 *    limited by SESSION_LIFETIME.
 * 2. Every later request on this host — a plain page load, or a client-side
 *    fetch('/api/...') that has no idea a prefix exists — carries that
 *    cookie automatically (the browser does this for every request, no
 *    frontend code involved) and is attributed to the same tenant, exactly
 *    like the Host header already does for a subdomain.
 *
 * Runs as a genuinely global middleware — prepended before Laravel even
 * attempts to match a route (unlike ResolveTenantFromDomain, which is part
 * of the 'web' group and so only runs once a route has already matched) —
 * so it can rewrite the request before routing sees it, for every route in
 * the app, admin included, with nothing to register or remember per page.
 */
class RewriteTenantPathPrefix
{
    private const COOKIE = 'tenant_path';
    private const COOKIE_MINUTES = 60 * 24 * 365; // a year — well past any session timeout

    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $adminDomain = config('app.admin_domain');
        $appUrlHost = parse_url((string) config('app.url'), PHP_URL_HOST);
        $isAdminHost = ($adminDomain && $host === $adminDomain) || ($appUrlHost && $host === $appUrlHost);

        // A real registered domain (subdomain/custom) is resolved entirely by
        // ResolveTenantFromDomain via the Host header — never touched here.
        if (!$isAdminHost) {
            return $next($request);
        }

        $segments = $request->segments();
        $slug = $segments[0] ?? null;

        // The bare root URL is the way out of a tenant: it always shows the
        // default site for this request and forgets the cookie, so a link
        // back to "our own site" doesn't need to exist anywhere in the app.
        if (!$slug && $request->cookies->has(self::COOKIE)) {
            $response = $next($request);
            $response->headers->clearCookie(self::COOKIE, '/');

            return $response;
        }

        if ($slug && !in_array($slug, Domain::RESERVED_PATH_SLUGS, true)) {
            $domain = Domain::where('type', 'path')->where('domain', $slug)->first();

            if ($domain) {
                $tenant = Tenant::find($domain->tenant_id);

                if (!$tenant || $tenant->status !== 'active') {
                    abort(503, 'This link is currently inactive.');
                }

                return $this->routeAsTenant($request, $next, $tenant, $slug, prefixInUrl: true, remember: true);
            }
        }

        // No explicit prefix this time — a cookie from an earlier /{slug}
        // visit means every other request (including plain API calls) on
        // this host should still resolve to that same agency.
        if ($cookieSlug = $request->cookies->get(self::COOKIE)) {
            $domain = Domain::where('type', 'path')->where('domain', $cookieSlug)->first();
            $tenant = $domain ? Tenant::find($domain->tenant_id) : null;

            if ($tenant && $tenant->status === 'active') {
                return $this->routeAsTenant($request, $next, $tenant, $cookieSlug, prefixInUrl: false, remember: false);
            }
        }

        return $next($request);
    }

    /**
     * @param  bool  $prefixInUrl  True only when /{slug} was actually the
     *                             current request's own URL — used by
     *                             AppServiceProvider to decide whether the
     *                             browser's address bar should show it.
     * @param  bool  $remember     Refreshes the cookie so it doesn't quietly
     *                             expire while someone keeps browsing.
     */
    private function routeAsTenant(Request $request, Closure $next, Tenant $tenant, string $slug, bool $prefixInUrl, bool $remember): Response
    {
        if ($prefixInUrl) {
            $segments = $request->segments();
            $remaining = array_slice($segments, 1);
            $newPath = $remaining ? '/' . implode('/', $remaining) : '/';
            $query = $request->getQueryString();

            $newRequest = Request::create(
                $newPath . ($query ? '?' . $query : ''),
                $request->method(),
                $request->request->all(),
                $request->cookies->all(),
                $request->files->all(),
                $request->server->all(),
                $request->getContent(),
            );
            $newRequest->headers->replace($request->headers->all());
            $newRequest->attributes->replace($request->attributes->all());
            $request = $newRequest;
        }

        $request->attributes->set('tenant', $tenant);
        $request->attributes->set('tenant_id', $tenant->id);
        $request->attributes->set('tenant_path', $slug);
        $request->attributes->set('tenant_path_in_url', $prefixInUrl);

        $response = $next($request);

        if ($remember) {
            $response->headers->setCookie(Cookie::create(
                self::COOKIE,
                $slug,
                now()->addMinutes(self::COOKIE_MINUTES),
                path: '/',
                secure: $request->isSecure(),
                httpOnly: true,
                sameSite: 'lax',
            ));
        }

        return $response;
    }
}
