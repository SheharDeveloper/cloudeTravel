<?php

namespace App\Http\Controllers;

use App\Services\TravelQuoteFeedback\TravelQuoteFeedbackService;
use Illuminate\Http\Request;

class QuoteFeedbackController extends Controller
{
    protected $feedbackService;

    public function __construct(TravelQuoteFeedbackService $feedbackService)
    {
        $this->feedbackService = $feedbackService;
    }

    public function submit(Request $request)
    {
        try {
            $validated = $request->validate([
                'travel_quote_uid' => 'required|string|exists:travel_quotes,uid',
                'decision' => 'required|in:accept,reject',
                'reason' => 'nullable|string|max:500',
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone_number' => 'required|string|max:20'
            ]);

            $this->feedbackService->createFeedback($validated);

            return back()->with('success', 'Feedback saved successfully');
        } catch (\Exception $e) {
            \Log::error('Feedback Error: ' . $e->getMessage());
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

}
