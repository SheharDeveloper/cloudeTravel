<?php

namespace App\Http\Controllers\Admin;

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

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:inactive,active,pending,accept,reject'
        ]);

        $this->feedbackService->updateStatus($id, $validated['status']);

        return back()->with('success', 'Feedback status updated successfully');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_number' => 'required|string|max:20',
            'status' => 'required|in:inactive,active,pending,accept,reject',
            'reason' => 'nullable|string|max:500'
        ]);

        $this->feedbackService->updateFeedback($id, $validated);

        return back()->with('success', 'Feedback updated successfully');
    }

    public function destroy($id)
    {
        $this->feedbackService->deleteFeedback($id);
        return back()->with('success', 'Feedback deleted successfully');
    }
}
