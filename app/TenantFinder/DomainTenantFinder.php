<?php

namespace App\TenantFinder;

use App\Models\Domain;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Spatie\Multitenancy\TenantFinder\TenantFinder;

class DomainTenantFinder extends TenantFinder
{
    private ?string $centralizedDomain = null;

    protected function getCentralizedDomain(): ?string
    {
        if ($this->centralizedDomain === null) {
            $this->centralizedDomain = config('app.admin_domain') ?? env('ADMIN_DOMAIN');
        }
        return $this->centralizedDomain;
    }

    public function findForRequest(Request $request)
    {
        $host = $request->getHost();

        // 1. Check if it's the centralized/superadmin domain
        if ($this->isCentralizedDomain($host)) {
            return null; // Return null for centralized domain (superadmin area)
        }

        // 2. Try to find agency by domain
        $tenant = $this->findByDomain($host) ?? $this->findBySubdomain($host);

        // 3. If no tenant found, return null (will show contact info)
        return $tenant;
    }

    private function isCentralizedDomain(string $host): bool
    {
        $adminDomain = $this->getCentralizedDomain();

        if (!$adminDomain) {
            return false;
        }

        // Only exact match for admin domain (127.0.0.1)
        return $host === $adminDomain;
    }

    private function findByDomain(string $host)
    {
        $domain = Domain::where('domain', $host)
            ->where('verified_at', '!=', null)
            ->with('tenant')
            ->first();

        return $domain?->tenant;
    }

    private function findBySubdomain(string $host)
    {
        $subdomain = $this->extractSubdomain($host);

        if (!$subdomain || $subdomain === 'www' || $subdomain === 'admin') {
            return null;
        }

        return Tenant::where('slug', $subdomain)->first();
    }

    private function extractSubdomain(string $host): ?string
    {
        $parts = explode('.', $host);

        if (count($parts) < 3) {
            return null;
        }

        return $parts[0];
    }
}
