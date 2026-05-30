<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AgencyService;
use Illuminate\Http\Request;

/**
 * Controller for managing agency services via API
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
        try {
            $services = AgencyService::where('user_id', $userId)->get();
            return response()->json($services);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a new agency service
     *
     * @param Request $request Contains service_name and optional status
     * @param int $userId The user/agency ID
     * @return \Illuminate\Http\JsonResponse Created service object
     */
    public function store(Request $request, $userId)
    {
        try {
            $validated = $request->validate([
                'service_name' => 'required|string|max:255',
                'status' => 'in:Active,Inactive',
            ]);

            $service = AgencyService::create([
                'user_id' => $userId,
                'service_name' => $validated['service_name'],
                'status' => $validated['status'] ?? 'Active',
            ]);

            return response()->json($service, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete a service from an agency
     *
     * @param int $userId The user/agency ID
     * @param int $serviceId The service ID to delete
     * @return \Illuminate\Http\JsonResponse Success message
     */
    public function destroy($userId, $serviceId)
    {
        try {
            $service = AgencyService::where('user_id', $userId)->findOrFail($serviceId);
            $service->delete();
            return response()->json(['message' => 'Service deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
