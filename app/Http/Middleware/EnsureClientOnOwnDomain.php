<?php

namespace App\Http\Middleware;

use App\Services\ClientPortalService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Client pages (My Profile…) open only for a signed-in client of the agency
 * whose domain this is. Anyone else — not signed in, a client of another
 * agency, or a client who can no longer sign in — goes to Client Login.
 */
class EnsureClientOnOwnDomain
{
    public function __construct(protected ClientPortalService $portal)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->portal->currentClient($request)) {
            // Signed in, but not for this agency (or no longer allowed): sign out first
            if (auth('client')->check()) {
                $this->portal->logout($request);
            }

            return redirect()->route('agency.client-login');
        }

        return $next($request);
    }
}
