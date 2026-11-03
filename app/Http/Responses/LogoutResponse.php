<?php

namespace App\Http\Responses;

use Inertia\Inertia;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;

/**
 * After signing out: a full page load of the login page, not an in-page swap,
 * so none of the admin theme's stylesheets carry over onto it.
 */
class LogoutResponse implements LogoutResponseContract
{
    public function toResponse($request)
    {
        return $request->wantsJson()
            ? response()->noContent()
            : Inertia::location(route('login'));
    }
}
