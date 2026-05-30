<?php

namespace App\Http\Controllers\Api\Agency;

use App\Http\Controllers\Controller;
use App\Http\Requests\Agency\StoreAgencyRequest;
use App\Http\Requests\Agency\UpdateAgencyRequest;
use App\Models\Agency;
use App\Services\AgencyService;
use Illuminate\Http\JsonResponse;
use Throwable;

class AgencyController extends Controller
{
    public function __construct(private AgencyService $agencyService)
    {
    }

    public function index(): JsonResponse
    {
        try {
            \Log::info('=== GET AGENCIES ===');
            $agencies = $this->agencyService->getAllAgencies();
            \Log::info('Agencies retrieved:', ['count' => count($agencies)]);

            return response()->json([
                'status' => 'success',
                'data' => $agencies,
            ], 200);
        } catch (Throwable $e) {
            \Log::error('❌ Error getting agencies: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Agency $agency): JsonResponse
    {
        try {
            $agency = $this->agencyService->getAgencyById($agency->id);
            return response()->json([
                'status' => 'success',
                'data' => $agency,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(StoreAgencyRequest $request): JsonResponse
    {
        try {
            \Log::info('=== STORE AGENCY REQUEST ===');
            \Log::info('Validated data:', $request->validated());

            $agency = $this->agencyService->createAgency($request->validated());

            \Log::info('✅ Agency created successfully');
            \Log::info('Created agency:', $agency->toArray());

            return response()->json([
                'status' => 'success',
                'message' => 'Agency created successfully',
                'data' => $agency,
            ], 201);
        } catch (Throwable $e) {
            \Log::error('❌ Error creating agency: ' . $e->getMessage());
            \Log::error('Stack trace:', [$e->getTraceAsString()]);

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(UpdateAgencyRequest $request, Agency $agency): JsonResponse
    {
        try {
            $updated = $this->agencyService->updateAgency($agency->id, $request->validated());
            return response()->json([
                'status' => 'success',
                'message' => 'Agency updated successfully',
                'data' => $updated,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Agency $agency): JsonResponse
    {
        try {
            $this->agencyService->deleteAgency($agency->id);
            return response()->json([
                'status' => 'success',
                'message' => 'Agency deleted successfully',
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}