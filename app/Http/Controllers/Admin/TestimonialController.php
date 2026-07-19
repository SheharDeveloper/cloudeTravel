<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    protected $settingsService;

    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    public function index()
    {
        $isreviewEnabled = $this->settingsService->getIsreviewEnabled();

        return inertia('Admin/Testimonial/Index', [
            'isreviewEnabled' => $isreviewEnabled,
        ]);
    }

    public function toggleReview(Request $request)
    {
        $validated = $request->validate([
            'isreview' => 'required|boolean',
        ]);

        $this->settingsService->update($validated);
        $isreviewEnabled = $this->settingsService->getIsreviewEnabled();

        return inertia('Admin/Testimonial/Index', [
            'isreviewEnabled' => $isreviewEnabled,
        ]);
    }
}
