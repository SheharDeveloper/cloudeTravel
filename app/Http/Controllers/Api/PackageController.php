<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    /**
     * GET ALL PACKAGES - Retrieve all package records
     * Public endpoint: returns only active packages
     * Admin endpoint (with auth): returns all packages
     */
    public function index()
    {
        $query = Package::query();

        if (!auth()->check()) {
            $query->where('status', 1);
        }

        return response()->json([
            'data' => $query->orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * SHOW SINGLE PACKAGE - Get package details by ID
     */
    public function show(Package $package)
    {
        return response()->json([
            'data' => $package,
        ]);
    }

    /**
     * CREATE PACKAGE - Store new package in database
     * POST /api/packages
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:packages',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'origin_country' => 'nullable|string|max:255',
            'destination_country' => 'required|string|max:255',
            'hotel_name' => 'nullable|string|max:255',
            'hotel_stars' => 'nullable|integer|min:0|max:5',
            'duration_days' => 'nullable|integer|min:0',
            'travel_export_included' => 'required|boolean',
            'visa_service_included' => 'required|boolean',
            'status' => 'required|boolean',
            'is_featured' => 'required|boolean',
        ]);

        try {
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('packages', 'public');
                $validated['image'] = '/storage/' . $imagePath;
            }

            $package = Package::create($validated);

            return response()->json([
                'data' => $package,
                'message' => 'Package created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating package: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * UPDATE PACKAGE - Update existing package
     * PUT /api/packages/{id}
     */
    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255|unique:packages,name,' . $package->id,
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'origin_country' => 'nullable|string|max:255',
            'destination_country' => 'nullable|string|max:255',
            'hotel_name' => 'nullable|string|max:255',
            'hotel_stars' => 'nullable|integer|min:0|max:5',
            'duration_days' => 'nullable|integer|min:0',
            'travel_export_included' => 'nullable|boolean',
            'visa_service_included' => 'nullable|boolean',
            'status' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
        ]);

        try {
            if ($request->hasFile('image')) {
                if ($package->image && file_exists(public_path($package->image))) {
                    unlink(public_path($package->image));
                }

                $imagePath = $request->file('image')->store('packages', 'public');
                $validated['image'] = '/storage/' . $imagePath;
            }

            $package->update(array_filter($validated, fn($value) => !is_null($value)));

            return response()->json([
                'data' => $package,
                'message' => 'Package updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating package: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * DELETE PACKAGE - Remove package from database
     * DELETE /api/packages/{id}
     */
    public function destroy(Package $package)
    {
        try {
            if ($package->image && file_exists(public_path($package->image))) {
                unlink(public_path($package->image));
            }

            $package->delete();

            return response()->json([
                'message' => 'Package deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting package: ' . $e->getMessage(),
            ], 500);
        }
    }
}
