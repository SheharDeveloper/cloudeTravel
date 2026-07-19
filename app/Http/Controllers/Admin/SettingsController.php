<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    protected $settingsService;

    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    public function getSettings()
    {
        $settings = $this->settingsService->getAll();
        return response()->json($settings);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'isreview' => 'required|boolean',
        ]);

        $settings = $this->settingsService->update($validated);

        return response()->json([
            'message' => 'Settings updated successfully',
            ...$settings,
        ]);
    }
}
