<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ContactInfoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactInfoController extends Controller
{
    private ContactInfoService $contactInfoService;

    public function __construct(ContactInfoService $contactInfoService)
    {
        $this->contactInfoService = $contactInfoService;
    }

    /**
     * Get contact info (public endpoint)
     */
    public function index(): JsonResponse
    {
        $contact = $this->contactInfoService->getInfo();
        return response()->json($contact);
    }

    /**
     * Create or update contact info (protected)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'location' => 'nullable|string',
            'address' => 'nullable|string',
            'facebook_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'about_text' => 'nullable|string',
            'logo' => 'nullable|file|mimes:jpeg,png,gif,webp|max:5120',
            'get_in_touch_image' => 'nullable|file|mimes:jpeg,png,gif,webp|max:5120',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo');
        }

        if ($request->hasFile('get_in_touch_image')) {
            $validated['get_in_touch_image'] = $request->file('get_in_touch_image');
        }

        $contact = $this->contactInfoService->save($validated);
        return response()->json($contact, 201);
    }

    /**
     * Update contact info (protected)
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'location' => 'nullable|string',
            'address' => 'nullable|string',
            'facebook_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'about_text' => 'nullable|string',
            'logo' => 'nullable|file|mimes:jpeg,png,gif,webp|max:5120',
            'get_in_touch_image' => 'nullable|file|mimes:jpeg,png,gif,webp|max:5120',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo');
        }

        if ($request->hasFile('get_in_touch_image')) {
            $validated['get_in_touch_image'] = $request->file('get_in_touch_image');
        }

        $contact = $this->contactInfoService->save($validated);
        return response()->json($contact);
    }
}
