<?php

namespace App\Http\Responses;

use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

/**
 * After signing in: a full page load of where the user was going (the
 * dashboard by default), not an in-page Inertia swap. The login page doesn't
 * load the admin theme's stylesheets; a full load gets them in the page head,
 * so the first page after login isn't drawn unstyled.
 */
class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $target = redirect()->intended(config('fortify.home'))->getTargetUrl();

        return $request->wantsJson()
            ? response()->json(['two_factor' => false])
            : Inertia::location($target);
    }
}
