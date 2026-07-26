<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TravelQuoteFeedback\TravelQuoteFeedbackService;
use Illuminate\Http\Request;

class TravelQuoteFeedbackController extends Controller
{
    protected $feedbackService;

    public function __construct(TravelQuoteFeedbackService $feedbackService)
    {
        $this->feedbackService = $feedbackService;
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'travel_quote_uid' => 'required|string|exists:travel_quotes,uid',
                'status' => 'required|in:accept,reject',
                'reason' => 'nullable|string|max:500',
                'name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone_number' => 'nullable|string|max:20'
            ]);

            $this->feedbackService->createFeedback($validated);

            return response()->json(['success' => true, 'message' => 'Feedback saved successfully']);
        } catch (\Exception $e) {
            \Log::error('Feedback Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:inactive,active,pending,accept,reject'
            ]);

            $this->feedbackService->updateStatus($id, $validated['status']);

            return response()->json(['success' => true, 'message' => 'Feedback updated successfully']);
        } catch (\Exception $e) {
            \Log::error('Feedback Update Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
