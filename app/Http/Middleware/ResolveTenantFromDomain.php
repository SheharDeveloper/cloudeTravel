<?php

namespace App\Http\Middleware;

use App\Models\Domain;
use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenantFromDomain
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $adminDomain = config('app.admin_domain');
        // APP_URL's own host is just as much "the admin domain" as
        // ADMIN_DOMAIN — e.g. APP_URL=http://localhost:8000 but
        // ADMIN_DOMAIN=127.0.0.1 both point at the same bare server, so
        // either one reaching here should bypass tenant resolution.
        $appUrlHost = parse_url((string) config('app.url'), PHP_URL_HOST);

        // Only bypass tenant checking for the admin/app host from .env
        if (($adminDomain && $host === $adminDomain) || ($appUrlHost && $host === $appUrlHost)) {
            $request->attributes->set('tenant', null);
            return $next($request);
        }

        // For all other domains, check Domain table
        try {
            $domain = Domain::where('domain', $host)->first();

            if ($domain) {
                // Get associated tenant
                $tenant = Tenant::find($domain->tenant_id);

                if ($tenant && $tenant->status === 'active') {
                    // Set tenant in request attributes
                    $request->attributes->set('tenant', $tenant);
                    $request->attributes->set('tenant_id', $tenant->id);
                    return $next($request);
                } else {
                    // Domain found but tenant is inactive or not found
                    return $this->domainError($request, 'errors.domain-inactive', 503, 'This domain is currently inactive.');
                }
            } else {
                // Domain not found in table - return 404
                return $this->domainError($request, 'errors.domain-not-registered', 404, 'This domain is not registered.');
            }
        } catch (\Exception $e) {
            \Log::error('Tenant resolution failed for domain ' . $host . ': ' . $e->getMessage());
            return $this->domainError($request, 'errors.domain-not-registered', 404, 'This domain is not registered.');
        }
    }

    /**
     * API requests need a JSON error, not an HTML view — a fetch() call
     * hitting an unregistered/inactive domain shouldn't get an HTML page.
     */
    private function domainError(Request $request, string $view, int $status, string $message): Response
    {
        if ($request->is('api/*') || $request->expectsJson()) {
            return response()->json(['error' => $message], $status);
        }

        return response()->view($view, [], $status);
    }
}
