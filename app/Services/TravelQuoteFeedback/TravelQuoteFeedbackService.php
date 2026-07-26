<?php

namespace App\Services\TravelQuoteFeedback;

use App\Models\TravelQuoteFeedback;
use App\Models\TravelQuote;

class TravelQuoteFeedbackService
{
    /**
     * Create new feedback
     */
    public function createFeedback(array $data)
    {
        $travelQuote = TravelQuote::where('uid', $data['travel_quote_uid'])->first();

        return TravelQuoteFeedback::create([
            'travel_quote_id' => $travelQuote->id,
            'status' => $data['decision'] ?? 'accept',
            'reason' => $data['reason'] ?? null,
            'name' => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
            'phone_number' => $data['phone_number'] ?? null
        ]);
    }

    /**
     * Update feedback status
     */
    public function updateStatus($id, $status)
    {
        $feedback = TravelQuoteFeedback::findOrFail($id);
        $feedback->update(['status' => $status]);
        return $feedback;
    }

    /**
     * Get all feedback for a quote
     */
    public function getQuoteFeedback($quoteId)
    {
        return TravelQuoteFeedback::where('travel_quote_id', $quoteId)->get();
    }

    /**
     * Get feedback by ID
     */
    public function getFeedbackById($id)
    {
        return TravelQuoteFeedback::findOrFail($id);
    }

    /**
     * Delete feedback
     */
    public function deleteFeedback($id)
    {
        return TravelQuoteFeedback::destroy($id);
    }

    /**
     * Update feedback with all fields
     */
    public function updateFeedback($id, array $data)
    {
        $feedback = TravelQuoteFeedback::findOrFail($id);
        $feedback->update($data);
        return $feedback;
    }

    /**
     * Get all feedback paginated
     */
    public function getAllFeedback($perPage = 20)
    {
        return TravelQuoteFeedback::with('travelQuote')->paginate($perPage);
    }
}
