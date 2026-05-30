<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\AgencyService;
use Illuminate\Http\Request;

/**
 * Controller for managing agency services
 * Handles CRUD operations for services assigned to agencies/users
 */
class AgencyServiceController extends Controller
{
    /**
     * Get all services for a specific user/agency
     *
     * @param int $userId The user/agency ID
     * @return \Illuminate\Http\JsonResponse List of services
     */
    public function index($userId)
    {
        $services = AgencyService::where('user_id', $userId)->get();
        return response()->json($services);
    }

    /**
     * Create a new agency service
     *
     * @param Request $request Contains service_name and status
     * @param int $userId The user/agency ID
     * @return \Illuminate\Http\JsonResponse Created service object
     */
    public function store(Request $request, $userId)
    {
        // Validate incoming request data
        $validated = $request->validate([
            'service_name' => 'required|string|max:255',
            'status' => 'required|in:Active,Inactive',
        ]);

        try {
            // Create new service record
            $service = AgencyService::create([
                'user_id' => $userId,
                'service_name' => $validated['service_name'],
                'status' => $validated['status'],
            ]);

            return response()->json($service, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete a service from an agency
     *
     * @param Request $request
     * @param int $userId The user/agency ID
     * @param int $serviceId The service ID to delete
     * @return \Illuminate\Http\JsonResponse Success message
     */
    public function destroy(Request $request, $userId, $serviceId)
    {
        try {
            // Find and delete the service
            $service = AgencyService::where('user_id', $userId)->findOrFail($serviceId);
            $service->delete();
            return response()->json(['message' => 'Service deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
