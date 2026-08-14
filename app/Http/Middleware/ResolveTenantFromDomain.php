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

        // Only bypass tenant checking for ADMIN_DOMAIN from .env
        if ($adminDomain && $host === $adminDomain) {
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
                    return response()->view('errors.domain-inactive', [], 503);
                }
            } else {
                // Domain not found in table - return 404
                return response()->view('errors.domain-not-registered', [], 404);
            }
        } catch (\Exception $e) {
            \Log::error('Tenant resolution failed for domain ' . $host . ': ' . $e->getMessage());
            return response()->view('errors.domain-not-registered', [], 404);
        }
    }
}
