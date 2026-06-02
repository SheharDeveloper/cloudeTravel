<?php

namespace App\Http\Controllers\Api;

use App\Models\Tour;
use App\Models\Highlight;
use App\Models\Itinerary;
use App\Models\KeyDestination;
use App\Models\TermsCondition;
use App\Services\TourService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TourController
{
    protected $tourService;

    /**
     * Initialize TourController with TourService dependency
     */
    public function __construct(TourService $tourService)
    {
        $this->tourService = $tourService;
    }

    /**
     * Display a listing of all tours
     * GET /api/tours
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Get pagination parameters with defaults
            $perPage = $request->get('per_page', 15);
            $page = $request->get('page', 1);
            $status = $request->get('status');
            $search = $request->get('search');
            $featured = $request->get('featured');

            // Fetch tours using service
            $tours = $this->tourService->getAllTours($page, $perPage, $status, $search, $featured);

            return response()->json([
                'success' => true,
                'message' => 'Tours retrieved successfully',
                'data' => $tours,
                'currency' => [
                    'code' => config('currency.code'),
                    'symbol' => config('currency.symbol'),
                    'name' => config('currency.name'),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving tours: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created tour in database
     * POST /api/tours
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validate incoming request data
            $validated = $request->validate([
                'tour_title' => 'required|string|max:255',
                'hero_title' => 'required|string|max:255',
                'hero_subtitle' => 'nullable|string',
                'short_description' => 'nullable|string',
                'country' => 'required|string|max:100',
                'city' => 'required|string|max:100',
                'duration_days' => 'required|integer|min:1',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'status' => 'required|in:active,inactive,draft',
                'early_booking_price_text' => 'nullable|string|max:255',
                'feature_image' => 'nullable|image|max:10240',
                'banner_images' => 'nullable|array',
                'banner_images.*' => 'image|max:10240',
                'highlights' => 'nullable|array',
                'highlights.*.title' => 'required_with:highlights|string',
                'highlights.*.description' => 'nullable|string',
                'highlights.*.short_order' => 'nullable|integer',
                'itineraries' => 'nullable|array',
                'itineraries.*.day' => 'required_with:itineraries|integer',
                'itineraries.*.date' => 'required_with:itineraries|date',
                'itineraries.*.title' => 'required_with:itineraries|string',
                'itineraries.*.location' => 'required_with:itineraries|string',
                'itineraries.*.description' => 'nullable|string',
                'key_destinations' => 'nullable|array',
                'key_destinations.*.destination_name' => 'required_with:key_destinations|string',
                'key_destinations.*.location' => 'nullable|string',
                'key_destinations.*.description' => 'nullable|string',
                'terms_conditions' => 'nullable|array',
                'terms_conditions.*.type' => 'required_with:terms_conditions|in:package_includes,package_does_not_include',
                'terms_conditions.*.policy' => 'required_with:terms_conditions|string',
            ]);

            // Create tour using service
            $tour = $this->tourService->createTourWithRelations($validated);

            return response()->json([
                'success' => true,
                'message' => 'Tour created successfully',
                'data' => $tour,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating tour: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified tour
     * GET /api/tours/{id}
     *
     * @param Tour $tour
     * @return JsonResponse
     */
    public function show(Tour $tour): JsonResponse
    {
        try {
            // Load tour with all relationships
            $tour->load(['highlights', 'itineraries', 'keyDestinations', 'termsConditions']);

            return response()->json([
                'success' => true,
                'message' => 'Tour retrieved successfully',
                'data' => $tour,
                'currency' => [
                    'code' => config('currency.code'),
                    'symbol' => config('currency.symbol'),
                    'name' => config('currency.name'),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving tour: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified tour
     * PUT/PATCH /api/tours/{id}
     *
     * @param Request $request
     * @param Tour $tour
     * @return JsonResponse
     */
    public function update(Request $request, Tour $tour): JsonResponse
    {
        try {
            // Validate incoming request data
            $validated = $request->validate([
                'tour_title' => 'sometimes|required|string|max:255',
                'hero_title' => 'sometimes|required|string|max:255',
                'hero_subtitle' => 'nullable|string',
                'short_description' => 'nullable|string',
                'country' => 'sometimes|required|string|max:100',
                'city' => 'sometimes|required|string|max:100',
                'duration_days' => 'sometimes|required|integer|min:1',
                'start_date' => 'sometimes|required|date',
                'end_date' => 'sometimes|required|date|after_or_equal:start_date',
                'status' => 'sometimes|required|in:active,inactive,draft',
                'early_booking_price_text' => 'nullable|string|max:255',
                'feature_image' => 'nullable|image|max:10240',
                'banner_images' => 'nullable|array',
                'banner_images.*' => 'image|max:10240',
                'highlights' => 'nullable|array',
                'highlights.*.id' => 'nullable|integer',
                'highlights.*.title' => 'required_with:highlights|string',
                'highlights.*.description' => 'nullable|string',
                'highlights.*.short_order' => 'nullable|integer',
                'itineraries' => 'nullable|array',
                'itineraries.*.id' => 'nullable|integer',
                'itineraries.*.day' => 'required_with:itineraries|integer',
                'itineraries.*.date' => 'required_with:itineraries|date',
                'itineraries.*.title' => 'required_with:itineraries|string',
                'itineraries.*.location' => 'required_with:itineraries|string',
                'itineraries.*.description' => 'nullable|string',
                'key_destinations' => 'nullable|array',
                'key_destinations.*.id' => 'nullable|integer',
                'key_destinations.*.destination_name' => 'required_with:key_destinations|string',
                'key_destinations.*.location' => 'nullable|string',
                'key_destinations.*.description' => 'nullable|string',
                'terms_conditions' => 'nullable|array',
                'terms_conditions.*.id' => 'nullable|integer',
                'terms_conditions.*.type' => 'required_with:terms_conditions|in:package_includes,package_does_not_include',
                'terms_conditions.*.policy' => 'required_with:terms_conditions|string',
            ]);

            // Update tour using service
            $tour = $this->tourService->updateTourWithRelations($tour, $validated);

            return response()->json([
                'success' => true,
                'message' => 'Tour updated successfully',
                'data' => $tour,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating tour: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified tour from database
     * DELETE /api/tours/{id}
     *
     * @param Tour $tour
     * @return JsonResponse
     */
    public function destroy(Tour $tour): JsonResponse
    {
        try {
            // Delete tour and all related records (cascade delete)
            $tour->delete();

            return response()->json([
                'success' => true,
                'message' => 'Tour deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting tour: ' . $e->getMessage(),
            ], 500);
        }
    }
}
