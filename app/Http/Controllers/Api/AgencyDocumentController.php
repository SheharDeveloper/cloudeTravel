<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAgencyDocumentRequest;
use App\Http\Requests\UpdateAgencyDocumentRequest;
use App\Models\AgencyDocument;
use App\Services\AgencyDocumentService;
use Illuminate\Http\JsonResponse;
use Throwable;

class AgencyDocumentController extends Controller
{
    public function __construct(private AgencyDocumentService $agencyDocumentService)
    {
    }

    public function index(): JsonResponse
    {
        try {
            $documents = $this->agencyDocumentService->getAllAgencyDocuments();
            return response()->json([
                'status' => 'success',
                'data' => $documents,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(AgencyDocument $agencyDocument): JsonResponse
    {
        try {
            $document = $this->agencyDocumentService->getAgencyDocumentById($agencyDocument->id);
            return response()->json([
                'status' => 'success',
                'data' => $document,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(StoreAgencyDocumentRequest $request): JsonResponse
    {
        try {
            $document = $this->agencyDocumentService->createAgencyDocument($request->validated());
            return response()->json([
                'status' => 'success',
                'message' => 'Agency document created successfully',
                'data' => $document,
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(UpdateAgencyDocumentRequest $request, AgencyDocument $agencyDocument): JsonResponse
    {
        try {
            $updated = $this->agencyDocumentService->updateAgencyDocument($agencyDocument->id, $request->validated());
            return response()->json([
                'status' => 'success',
                'message' => 'Agency document updated successfully',
                'data' => $updated,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(AgencyDocument $agencyDocument): JsonResponse
    {
        try {
            $this->agencyDocumentService->deleteAgencyDocument($agencyDocument->id);
            return response()->json([
                'status' => 'success',
                'message' => 'Agency document deleted successfully',
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
