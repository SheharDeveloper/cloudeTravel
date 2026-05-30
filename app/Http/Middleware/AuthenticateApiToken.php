<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class AuthenticateApiToken
{
    public function handle(Request $request, Closure $next)
    {
        // Check if user is already authenticated via session
        if (Auth::check()) {
            return $next($request);
        }

        // Get token from Bearer header or cookie
        $token = $request->bearerToken() ?: $request->cookie('auth_token');

        if ($token) {
            // Find and validate the Sanctum token
            $personalAccessToken = PersonalAccessToken::findToken($token);

            if ($personalAccessToken && $personalAccessToken->tokenable) {
                $user = $personalAccessToken->tokenable;

                // Authenticate user using the 'sanctum' guard for this request
                Auth::guard('sanctum')->setUser($user);

                // Also set as default guard user
                Auth::setUser($user);

                // Ensure user resolver works
                $request->setUserResolver(function () use ($user) {
                    return $user;
                });

                return $next($request);
            }
        }

        // No valid authentication found
        return response()->json([
            'status' => 'error',
            'message' => 'Unauthenticated.'
        ], 401);
    }
}
