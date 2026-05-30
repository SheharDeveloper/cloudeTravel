<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SpecialOfferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SpecialOfferController extends Controller
{
    private SpecialOfferService $specialOfferService;

    public function __construct(SpecialOfferService $specialOfferService)
    {
        $this->specialOfferService = $specialOfferService;
    }

    /**
     * Get all special offers
     */
    public function index(): JsonResponse
    {
        $status = request()->query('status');
        $isAuthenticated = auth()->check();

        Log::info('Special Offers Request:', [
            'status_param'   => $status,
            'auth_check'     => $isAuthenticated,
            'user'           => auth()->user(),
            'sanctum_token'  => request()->bearerToken(),
        ]);

        // For SpecialOffer, showAll is true if authenticated
        $showAll = $isAuthenticated;
        $offers = $this->specialOfferService->getAll($showAll, $status);

        Log::info('Special Offers Response:', [
            'offers_count'   => count($offers),
            'note'           => 'SpecialOffer has no status field, showing all offers',
        ]);

        return response()->json($offers);
    }

    /**
     * Get a specific special offer
     */
    public function show($id): JsonResponse
    {
        $offer = $this->specialOfferService->getById($id);
        if (!$offer) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json($offer);
    }

    /**
     * Create a new special offer
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'airline' => 'required|string',
            'from' => 'required|string',
            'destinations' => 'required|string',
            'price' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $offer = $this->specialOfferService->create($validated);
        return response()->json($offer, 201);
    }

    /**
     * Update a special offer
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'airline' => 'sometimes|required|string',
            'from' => 'sometimes|required|string',
            'destinations' => 'sometimes|required|string',
            'price' => 'sometimes|required|string',
            'description' => 'nullable|string',
        ]);

        $offer = $this->specialOfferService->update($id, $validated);
        if (!$offer) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json($offer);
    }

    /**
     * Delete a special offer
     */
    public function destroy($id): JsonResponse
    {
        $deleted = $this->specialOfferService->delete($id);
        if (!$deleted) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Special offer deleted successfully',
            'deleted' => true,
        ]);
    }
}
