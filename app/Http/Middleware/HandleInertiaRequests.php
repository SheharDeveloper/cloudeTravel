<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            // Set only for agency sessions, so the layout can swap branding
            // and menu items without every controller passing them.
            // Permission names held by the current session, used to filter
            // the sidebar. Superadmin gets null, meaning "no restriction".
            'authPermissions' => function () {
                $agencyUser = \Illuminate\Support\Facades\Auth::guard('agency')->user();

                if ($agencyUser) {
                    // The owner login inherits everything the superadmin
                    // granted the agency as a whole. An individual staff
                    // member only sees what their own assigned role grants
                    // them, not the agency's full permission set.
                    return $agencyUser->is_owner
                        ? $agencyUser->agency->permissions->pluck('name')->all()
                        : $agencyUser->getAllPermissions()->pluck('name')->all();
                }

                // Admin side: permissions come from the user's roles.
                $user = \Illuminate\Support\Facades\Auth::guard('web')->user();

                return $user ? $user->getAllPermissions()->pluck('name')->all() : null;
            },

            // Named 'authAgency' so it cannot collide with an 'agency' page
            // prop (e.g. the agency being viewed on the admin detail page).
            'authAgency' => fn () => \Illuminate\Support\Facades\Auth::guard('agency')->check()
                ? \Illuminate\Support\Facades\Auth::guard('agency')->user()->agency
                : null,

            // Set while an impersonation session is active, so the layout
            // can show a persistent "return to my account" banner.
            'impersonating' => fn () => $request->session()->has('impersonator_id')
                ? [
                    'name' => $request->session()->get('impersonator_name'),
                    'currentName' => \Illuminate\Support\Facades\Auth::guard($request->session()->get('impersonator_guard'))->user()?->name,
                ]
                : null,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
