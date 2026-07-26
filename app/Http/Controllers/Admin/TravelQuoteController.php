<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TravelQuote;
use App\Services\TravelQuote\TravelQuoteService;
use Illuminate\Http\Request;

class TravelQuoteController extends Controller
{
    protected $travelQuoteService;

    /**
     * Constructor - Inject TravelQuoteService
     */
    public function __construct(TravelQuoteService $travelQuoteService)
    {
        $this->travelQuoteService = $travelQuoteService;
    }

    /**
     * Display all travel quotes
     */
    public function index()
    {
        $travelQuotes = $this->travelQuoteService->getAllQuotes();
        $currencySymbol = config('currency.symbol', '£');
        $currencyCode = config('currency.code', 'GBP');

        return inertia('Admin/TravelQuote/Index', [
            'travelQuotes' => $travelQuotes,
            'currencySymbol' => $currencySymbol,
            'currencyCode' => $currencyCode,
        ]);
    }

    /**
     * Store a new travel quote
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'display_name' => 'required|string',
                'check_in_date' => 'required|date',
                'checkout_date' => 'required|date|after_or_equal:check_in_date',
                'night' => 'required|integer|min:1',
                'hotel_details' => 'nullable|string',
                'flight_details' => 'nullable|string',
                'visa_details' => 'nullable|string',
                'travel_details' => 'nullable|string',
                'expiry_date' => 'nullable|date',
                'half_board' => 'nullable|string',
                'all_inclusive' => 'nullable|string',
                'show_hotel_name' => 'nullable|boolean',
                'show_individual_price' => 'nullable|boolean',
                'per_person_pricing' => 'nullable|boolean',
                'total_price' => 'nullable|numeric|min:0',
                'adults' => 'nullable|integer|min:0',
                'children' => 'nullable|integer|min:0',
                'infants' => 'nullable|integer|min:0',
                'price_summary' => 'nullable|string',
                'created_at' => 'nullable|date',
                'images.*' => 'nullable|image|max:2048',
            ]);

            // Parse JSON details if they are strings
            if (!empty($validated['hotel_details'])) {
                $validated['hotel_details'] = json_decode($validated['hotel_details'], true);
            }
            if (!empty($validated['flight_details'])) {
                $validated['flight_details'] = json_decode($validated['flight_details'], true);
            }
            if (!empty($validated['visa_details'])) {
                $validated['visa_details'] = json_decode($validated['visa_details'], true);
            }
            if (!empty($validated['travel_details'])) {
                $validated['travel_details'] = json_decode($validated['travel_details'], true);
            }
            if (!empty($validated['price_summary'])) {
                $validated['price_summary'] = json_decode($validated['price_summary'], true);
            }

            // Upload images if provided
            if ($request->hasFile('images')) {
                $imagePaths = $this->travelQuoteService->uploadImages($request->file('images'));
                $validated['images'] = $imagePaths;
            }

            $this->travelQuoteService->createQuote($validated);

            return back()->with('success', 'Travel Quote created successfully');
        } catch (\Exception $e) {
            \Log::error('Travel Quote Store Error: ' . $e->getMessage(), ['exception' => $e]);
            return back()->withErrors(['error' => 'Failed to create travel quote: ' . $e->getMessage()]);
        }
    }

    /**
     * Show a single travel quote
     */
    public function show(TravelQuote $travelQuote)
    {
        $quote = $this->travelQuoteService->getQuoteByUid($travelQuote->uid);
        $feedback = $quote->feedback ?? [];

        return inertia('Admin/TravelQuote/Show', [
            'travelQuote' => $quote,
            'feedback' => $feedback,
        ]);
    }

    /**
     * Update a travel quote
     */
    public function update(Request $request, TravelQuote $travelQuote)
    {
        try {
            $validated = $request->validate([
                'display_name' => 'required|string',
                'check_in_date' => 'required|date',
                'checkout_date' => 'required|date|after_or_equal:check_in_date',
                'night' => 'required|integer|min:1',
                'hotel_details' => 'nullable|string',
                'flight_details' => 'nullable|string',
                'visa_details' => 'nullable|string',
                'travel_details' => 'nullable|string',
                'expiry_date' => 'nullable|date',
                'half_board' => 'nullable|string',
                'all_inclusive' => 'nullable|string',
                'show_hotel_name' => 'nullable|boolean',
                'show_individual_price' => 'nullable|boolean',
                'per_person_pricing' => 'nullable|boolean',
                'total_price' => 'nullable|numeric|min:0',
                'adults' => 'nullable|integer|min:0',
                'children' => 'nullable|integer|min:0',
                'infants' => 'nullable|integer|min:0',
                'price_summary' => 'nullable|string',
                'created_at' => 'nullable|date',
                'images.*' => 'nullable|image|max:2048',
            ]);

            // Parse JSON details if they are strings
            if (!empty($validated['hotel_details'])) {
                $validated['hotel_details'] = json_decode($validated['hotel_details'], true);
            }
            if (!empty($validated['flight_details'])) {
                $validated['flight_details'] = json_decode($validated['flight_details'], true);
            }
            if (!empty($validated['visa_details'])) {
                $validated['visa_details'] = json_decode($validated['visa_details'], true);
            }
            if (!empty($validated['travel_details'])) {
                $validated['travel_details'] = json_decode($validated['travel_details'], true);
            }
            if (!empty($validated['price_summary'])) {
                $validated['price_summary'] = json_decode($validated['price_summary'], true);
            }

            // Handle image uploads and replacements
            if ($request->hasFile('images')) {
                // Delete old images
                if ($travelQuote->images && is_array($travelQuote->images)) {
                    $this->travelQuoteService->deleteAllImages($travelQuote->images);
                }

                // Upload new images
                $imagePaths = $this->travelQuoteService->uploadImages($request->file('images'));
                $validated['images'] = $imagePaths;
            }

            $this->travelQuoteService->updateQuote($travelQuote, $validated);

            return back()->with('success', 'Travel Quote updated successfully');
        } catch (\Exception $e) {
            \Log::error('Travel Quote Update Error: ' . $e->getMessage(), ['exception' => $e]);
            return back()->withErrors(['error' => 'Failed to update travel quote: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete a travel quote
     */
    public function destroy($id)
    {
        // Find quote by ID or uid
        $travelQuote = TravelQuote::where('id', $id)->orWhere('uid', $id)->firstOrFail();

        // Delete all associated images
        if ($travelQuote->images && is_array($travelQuote->images)) {
            $this->travelQuoteService->deleteAllImages($travelQuote->images);
        }

        $this->travelQuoteService->deleteQuote($travelQuote);

        // Return JSON response for API requests, redirect for web requests
        if (request()->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Travel Quote deleted successfully']);
        }

        return redirect()->route('admin.travel-quote.index')->with('success', 'Travel Quote deleted successfully');
    }
}
