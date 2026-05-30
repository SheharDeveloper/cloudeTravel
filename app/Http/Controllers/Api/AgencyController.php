<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAgencyRequest;
use App\Http\Requests\UpdateAgencyRequest;
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
            $agencies = $this->agencyService->getAllAgencies();
            return response()->json([
                'status' => 'success',
                'data' => $agencies,
            ], 200);
        } catch (Throwable $e) {
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
            $agency = $this->agencyService->createAgency($request->validated());
            return response()->json([
                'status' => 'success',
                'message' => 'Agency created successfully',
                'data' => $agency,
            ], 201);
        } catch (Throwable $e) {
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
