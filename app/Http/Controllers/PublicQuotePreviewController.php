<?php

namespace App\Http\Controllers;

use App\Services\TravelQuote\TravelQuoteService;

class PublicQuotePreviewController extends Controller
{
    protected $travelQuoteService;

    public function __construct(TravelQuoteService $travelQuoteService)
    {
        $this->travelQuoteService = $travelQuoteService;
    }

    public function __invoke($uid)
    {
        $travelQuote = $this->travelQuoteService->getPublicQuotePreview($uid);

        // Check if ANY non-inactive feedback exists for this quote
        $activeFeedback = null;
        if ($travelQuote->feedback && $travelQuote->feedback->count() > 0) {
            $activeFeedback = $travelQuote->feedback->where('status', '!=', 'inactive')->first();
        }
        $hasPreviousFeedback = $activeFeedback ? true : false;
        $feedbackStatus = $activeFeedback ? $activeFeedback->status : null;

        return inertia('Public/QuotePreview', [
            'travelQuote' => $travelQuote,
            'hasPreviousFeedback' => $hasPreviousFeedback,
            'feedbackStatus' => $feedbackStatus,
        ]);
    }
}
