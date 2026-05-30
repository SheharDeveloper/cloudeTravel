<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TestimonialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TestimonialController extends Controller
{
    private TestimonialService $testimonialService;

    public function __construct(TestimonialService $testimonialService)
    {
        $this->testimonialService = $testimonialService;
    }

    /**
     * Get all testimonials
     * - If status parameter provided, filter by that status value
     * - If authenticated, show all unless status is specified
     */
    public function index(): JsonResponse
    {
        $status = request()->query('status');
        $isAuthenticated = auth()->check();

        Log::info('Testimonials Request:', [
            'status_param'   => $status,
            'auth_check'     => $isAuthenticated,
            'user'           => auth()->user(),
            'sanctum_token'  => request()->bearerToken(),
        ]);

        // Determine showAll flag
        $showAll = $isAuthenticated && $status === null;
        $testimonials = $this->testimonialService->getAll($showAll, $status);

        Log::info('Testimonials Response:', [
            'showAll'        => $showAll,
            'status_filter'  => $status ?? ($showAll ? 'all' : 'status=1 default'),
            'testimonials_count' => count($testimonials),
        ]);

        return response()->json($testimonials);
    }

    /**
     * Get a specific testimonial
     */
    public function show($id): JsonResponse
    {
        $testimonial = $this->testimonialService->getById($id);
        if (!$testimonial) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json($testimonial);
    }

    /**
     * Create a new testimonial (protected)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_name' => 'required|string',
            'client_image' => 'nullable|file|mimes:jpeg,png,gif,webp|max:5120',
            'message' => 'required|string',
            'rating' => 'nullable|integer|between:1,5',
            'status' => 'nullable|integer|in:0,1',
            'order' => 'nullable|integer',
        ]);

        $validated['status'] = $validated['status'] ?? 1;
        $validated['order'] = $validated['order'] ?? 0;

        if ($request->hasFile('client_image')) {
            $validated['client_image'] = $request->file('client_image');
        }

        $testimonial = $this->testimonialService->create($validated);
        return response()->json($testimonial, 201);
    }

    /**
     * Update a testimonial (protected)
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'client_name' => 'sometimes|required|string',
            'client_image' => 'sometimes|nullable',
            'message' => 'sometimes|required|string',
            'rating' => 'nullable|integer|between:1,5',
            'status' => 'nullable|integer|in:0,1',
            'order' => 'nullable|integer',
        ]);

        if ($request->hasFile('client_image')) {
            $request->validate([
                'client_image' => 'file|mimes:jpeg,png,gif,webp|max:5120',
            ]);
            $validated['client_image'] = $request->file('client_image');
        }

        $testimonial = $this->testimonialService->update($id, $validated);
        if (!$testimonial) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json($testimonial);
    }

    /**
     * Delete a testimonial (protected)
     */
    public function destroy($id): JsonResponse
    {
        $deleted = $this->testimonialService->delete($id);
        if (!$deleted) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Testimonial deleted successfully',
            'deleted' => true,
        ]);
    }
}
