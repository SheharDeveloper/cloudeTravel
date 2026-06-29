<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Throwable;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid credentials',
                ], 401);
            }

            try {
                // Create API token manually
                $plainToken = Str::random(40);
                $hashedToken = hash('sha256', $plainToken);
                $now = now();

                \Log::info('Starting token creation', [
                    'user_id' => $user->id,
                    'plain_token' => substr($plainToken, 0, 10),
                ]);

                try {
                    DB::insert(
                        'INSERT INTO personal_access_tokens (tokenable_type, tokenable_id, name, token, abilities, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [
                            'App\\Models\\User',
                            $user->id,
                            'auth_token',
                            $hashedToken,
                            json_encode(['*']),
                            $now,
                            $now,
                        ]
                    );
                    \Log::info('Token created successfully');
                } catch (\Exception $dbError) {
                    \Log::error('Database insert error', [
                        'message' => $dbError->getMessage(),
                        'code' => $dbError->getCode(),
                    ]);
                    throw $dbError;
                }

                $token = $plainToken;
                \Log::info('Token assigned', ['token' => substr($token, 0, 10)]);

                // Return JSON response with token
                $userData = [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ];
                \Log::info('User data prepared', $userData);

                $response = response()->json([
                    'status' => 'success',
                    'message' => 'Login successful',
                    'data' => [
                        'user' => $userData,
                        'token' => $token,
                    ],
                ], 200);

                \Log::info('Response created successfully');

                // Add secure HTTP-only cookie for web routes
                $response->cookie('auth_token', $token, 120, '/', null, app()->environment('production'), true, false, 'lax');

                \Log::info('Cookie added successfully');

                return $response;
            } catch (Throwable $tokenError) {
                \Log::error('Token creation failed:', [
                    'user_id' => $user->id,
                    'error' => $tokenError->getMessage(),
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'Token creation failed: ' . $tokenError->getMessage(),
                ], 500);
            }
        } catch (Throwable $e) {
            \Log::error('Auth error:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if ($user && $user->currentAccessToken()) {
                $user->tokens()->where('id', $user->currentAccessToken()->id)->delete();
            }

            $response = response()->json([
                'status' => 'success',
                'message' => 'Logged out successfully',
            ], 200);

            // Clear the auth token cookie
            $response->cookie(
                name: 'auth_token',
                value: '',
                minutes: -1,
                path: '/',
                domain: null,
                secure: app()->environment('production'),
                httpOnly: true,
                sameSite: 'lax'
            );

            return $response;
        } catch (Throwable $e) {
            \Log::error('Logout error:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
