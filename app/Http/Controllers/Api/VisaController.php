<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visa;
use Illuminate\Http\Request;

class VisaController extends Controller
{
    /**
     * GET ALL VISAS - Retrieve all visa records
     * Public endpoint: returns only active visas
     * Admin endpoint (with auth): returns all visas
     */
    public function index()
    {
        $query = Visa::query();

        // If user is not authenticated, return only active visas
        if (!auth()->check()) {
            $query->where('status', 1);
        }

        return response()->json([
            'data' => $query->orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * SHOW SINGLE VISA - Get visa details by ID
     */
    public function show(Visa $visa)
    {
        return response()->json([
            'data' => $visa,
        ]);
    }

    /**
     * CREATE VISA - Store new visa in database
     * POST /api/visas
     * Requires: name, title, image, status
     * Optional: description
     */
    public function store(Request $request)
    {
        // Validate request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|boolean',
            'is_featured' => 'required|boolean',
        ]);

        try {
            // Handle image upload
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('visas', 'public');
                $validated['image'] = '/storage/' . $imagePath;
            }

            // Create visa record
            $visa = Visa::create($validated);

            return response()->json([
                'data' => $visa,
                'message' => 'Visa created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating visa: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * UPDATE VISA - Update existing visa
     * PUT /api/visas/{id}
     * Can update: name, title, description, image, status
     */
    public function update(Request $request, Visa $visa)
    {
        // Validate request data
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
        ]);

        try {
            // Handle image upload if provided
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($visa->image && file_exists(public_path($visa->image))) {
                    unlink(public_path($visa->image));
                }

                $imagePath = $request->file('image')->store('visas', 'public');
                $validated['image'] = '/storage/' . $imagePath;
            }

            // Update only provided fields
            $visa->update(array_filter($validated, fn($value) => !is_null($value)));

            return response()->json([
                'data' => $visa,
                'message' => 'Visa updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating visa: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * DELETE VISA - Remove visa from database
     * DELETE /api/visas/{id}
     */
    public function destroy(Visa $visa)
    {
        try {
            // Delete image file if exists
            if ($visa->image && file_exists(public_path($visa->image))) {
                unlink(public_path($visa->image));
            }

            // Delete visa record
            $visa->delete();

            return response()->json([
                'message' => 'Visa deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting visa: ' . $e->getMessage(),
            ], 500);
        }
    }
}
