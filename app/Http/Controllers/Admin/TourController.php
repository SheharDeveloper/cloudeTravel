<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Admin Tour Controller
 * Manages all tour-related operations for the admin dashboard
 */
class TourController extends Controller
{
    /**
     * Display list of all tours
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $tours = Tour::all();
        return Inertia::render('Admin/Tours/Index', ['tours' => $tours]);
    }

    /**
     * Show create tour form
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Tours/Create');
    }

    /**
     * Store new tour in database
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'duration' => 'required|string|max:100',
                'subtitle' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'nullable|numeric',
                'location' => 'nullable|string|max:255',
                'highlights' => 'nullable|array',
                'itinerary' => 'nullable|array',
                'package_includes' => 'nullable|array',
                'package_excludes' => 'nullable|array',
                'terms_conditions' => 'nullable|string',
            ]);

            $tour = Tour::create($validated);
            return response()->json(['message' => 'Tour created successfully', 'tour' => $tour], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show edit form for a tour
     *
     * @param Tour $tour
     * @return \Inertia\Response
     */
    public function edit(Tour $tour)
    {
        return Inertia::render('Admin/Tours/Edit', ['tour' => $tour]);
    }

    /**
     * Update tour in database
     *
     * @param Request $request
     * @param Tour $tour
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Tour $tour)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'duration' => 'required|string|max:100',
                'subtitle' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'nullable|numeric',
                'location' => 'nullable|string|max:255',
                'highlights' => 'nullable|array',
                'itinerary' => 'nullable|array',
                'package_includes' => 'nullable|array',
                'package_excludes' => 'nullable|array',
                'terms_conditions' => 'nullable|string',
            ]);

            $tour->update($validated);
            return response()->json(['message' => 'Tour updated successfully', 'tour' => $tour]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete a tour
     *
     * @param Tour $tour
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Tour $tour)
    {
        try {
            $tour->delete();
            return response()->json(['message' => 'Tour deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
