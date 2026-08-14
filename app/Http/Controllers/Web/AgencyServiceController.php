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
    public function index($agencyId)
    {
        $services = AgencyService::where('agency_id', $agencyId)->get();
        return response()->json($services);
    }

    /**
     * Create a new agency service
     *
     * @param Request $request Contains service_name and status
     * @param int $agencyId The agency ID
     * @return \Illuminate\Http\JsonResponse Created service object
     */
    public function store(Request $request, $agencyId)
    {
        $validated = $request->validate([
            'service_name' => 'required|string|max:255',
            'status' => 'boolean',
        ]);

        try {
            $service = AgencyService::create([
                'agency_id' => $agencyId,
                'service_name' => $validated['service_name'],
                'status' => $validated['status'] ?? 1,
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
     * @param int $agencyId The agency ID
     * @param int $serviceId The service ID to delete
     * @return \Illuminate\Http\JsonResponse Success message
     */
    public function destroy(Request $request, $agencyId, $serviceId)
    {
        try {
            $service = AgencyService::where('agency_id', $agencyId)->findOrFail($serviceId);
            $service->delete();
            return response()->json(['message' => 'Service deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
