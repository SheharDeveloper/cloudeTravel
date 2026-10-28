<?php

namespace App\Http\Middleware;

use App\Models\AgencyUser;
use App\Services\AttendanceService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Once a staff member has checked out for the day (themselves, or
 * automatically when their shift time ran out) they're signed out and can't
 * sign back in until tomorrow — unless their role has the "Login after
 * checkout" permission (attendance.login-after-checkout), which the
 * superadmin gives (and an agency, once the superadmin has given it to them).
 */
class BlockLoginAfterCheckout
{
    public function __construct(protected AttendanceService $attendance)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $staff = $this->attendance->currentPrincipal();
        if (! $staff || ! $this->attendance->isStaff($staff)) {
            return $next($request);
        }

        // Deactivated (Staff → Status off): no access at all
        if ($staff->status !== 'active') {
            return $this->signOut($request, $staff, 'Your account has been deactivated. Please contact your administrator.');
        }

        // Their time may have just run out
        $this->attendance->enforceTimeLimit($staff);

        $message = $this->attendance->loginBlockedMessage($staff);
        if (! $message) {
            return $next($request);
        }

        return $this->signOut($request, $staff, $message);
    }

    /** Signs the staff member out and sends them to their login page with the reason. */
    private function signOut(Request $request, \App\Models\User|AgencyUser $staff, string $message): Response
    {
        $isAgency = $staff instanceof AgencyUser;
        Auth::guard($isAgency ? 'agency' : 'web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Shown under the login form's email field
        $request->session()->flash('errors', (new \Illuminate\Support\ViewErrorBag())->put(
            'default',
            new \Illuminate\Support\MessageBag(['email' => $message])
        ));

        $login = $isAgency ? route('agency.login') : route('login');

        // An Inertia visit must leave the SPA for the login page
        return $request->header('X-Inertia') ? \Inertia\Inertia::location($login) : redirect($login);
    }
}
