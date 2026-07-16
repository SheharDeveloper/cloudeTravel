<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Update user profile from the ProfileSettings page (redirects to /profile).
     */
    public function updateFromProfile(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile');
    }

    /**
     * Upload profile picture and update profile information.
     */
    public function uploadProfile(Request $request): RedirectResponse
    {
        $user = $request->user();
        $isSuperAdmin = $user->type === 'super_admin';

        $emailRules = $isSuperAdmin
            ? ['required', 'email', 'max:255', 'unique:users,email,' . $user->id]
            : ['required', 'email', 'max:255'];

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => $emailRules,
            'phone' => ['nullable', 'regex:/^\d{10}$/'],
            'profile_pic' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        if (!$isSuperAdmin && $validated['email'] !== $user->email) {
            return back()->withErrors(['email' => 'You are not authorized to change your email.']);
        }

        $user->name = $validated['name'];
        $user->phone = $validated['phone'] ?? null;

        if ($isSuperAdmin) {
            $user->email = $validated['email'];
            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }
        }

        if ($request->hasFile('profile_pic')) {
            if ($user->profile_pic && Storage::exists('public/' . $user->profile_pic)) {
                Storage::delete('public/' . $user->profile_pic);
            }

            $path = $request->file('profile_pic')->store('profile-pictures', 'public');
            $user->profile_pic = $path;
        }

        $user->save();

        return to_route('profile');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
