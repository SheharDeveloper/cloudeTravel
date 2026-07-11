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
        $perPage = request()->query('per_page', 100);
        $page = request()->query('page', 1);
        $type = request()->query('type', null);
        $featured = request()->query('featured', null);
        $search = request()->query('search', null);

        $query = \App\Models\SpecialOffer::with('images')->where('is_active', true);

        // Filter by type
        if ($type) {
            $query->where('type', $type);
        }

        // Filter featured
        if ($featured === 'true' || $featured === '1') {
            $query->where('is_featured', true);
        }

        // Search by name or description
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $offers = $query->latest()->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'offers' => $offers->items(),
            'pagination' => [
                'total' => $offers->total(),
                'per_page' => $offers->perPage(),
                'current_page' => $offers->currentPage(),
                'last_page' => $offers->lastPage(),
                'from' => $offers->firstItem(),
                'to' => $offers->lastItem(),
            ]
        ]);
    }

    /**
     * Get a specific special offer by ID
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
     * Get a specific special offer by UID
     */
    public function showByUid($uid): JsonResponse
    {
        $offer = $this->specialOfferService->getByUid($uid);
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
