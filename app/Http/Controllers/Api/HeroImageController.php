<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\HeroImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class HeroImageController extends Controller
{
    private HeroImageService $heroImageService;

    public function __construct(HeroImageService $heroImageService)
    {
        $this->heroImageService = $heroImageService;
    }

    /**
     * Get all hero images
     * - If status parameter provided, filter by that status value
     * - If authenticated, show all unless status is specified
     */
    public function index(): JsonResponse
    {
        $status = request()->query('status');
       
        $images = $this->heroImageService->getAll($status);

        // Log::info('Hero Images Response:', [
        //     'showAll'        => $showAll,
        //     'status_filter'  => $status ?? ($showAll ? 'all' : 'status=1 default'),
        //     'images_count'   => count($images),
        // ]);

        return response()->json($images);
    }

    /**
     * Get a specific hero image
     */
    public function show($id): JsonResponse
    {
        $image = $this->heroImageService->getById($id);
        if (!$image) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json($image);
    }

    /**
     * Create a new hero image (protected)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image_url' => 'required|file|mimes:jpeg,png,gif,webp|max:5120',
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'status' => 'nullable|integer|in:0,1',
            'order' => 'nullable|integer',
        ]);

        $validated['recorder'] = auth()->id();
        $validated['status'] = $validated['status'] ?? 1;
        $validated['order'] = $validated['order'] ?? 0;

        if ($request->hasFile('image_url')) {
            $validated['image_url'] = $request->file('image_url');
        }

        $image = $this->heroImageService->create($validated);
        return response()->json($image, 201);
    }

    /**
     * Update a hero image (protected)
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'image_url' => 'sometimes|nullable',
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'status' => 'nullable|integer|in:0,1',
            'order' => 'nullable|integer',
        ]);

        if ($request->hasFile('image_url')) {
            $request->validate([
                'image_url' => 'file|mimes:jpeg,png,gif,webp|max:5120',
            ]);
            $validated['image_url'] = $request->file('image_url');
        }

        $image = $this->heroImageService->update($id, $validated);
        if (!$image) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json($image);
    }

    /**
     * Delete a hero image (protected)
     */
    public function destroy($id): JsonResponse
    {
        $deleted = $this->heroImageService->delete($id);
        if (!$deleted) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Hero image deleted successfully',
            'deleted' => true,
        ]);
    }
}
