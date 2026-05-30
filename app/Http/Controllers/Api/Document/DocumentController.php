<?php

namespace App\Http\Controllers\Api\Document;

use App\Http\Controllers\Controller;
use App\Http\Requests\Document\StoreDocumentRequest;
use App\Http\Requests\Document\UpdateDocumentRequest;
use App\Models\Document;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;
use Throwable;

class DocumentController extends Controller
{
    public function __construct(private DocumentService $documentService)
    {
    }

    public function index(): JsonResponse
    {
        try {
            $documents = $this->documentService->getAllDocuments();
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

    public function show(Document $document): JsonResponse
    {
        try {
            $document = $this->documentService->getDocumentById($document->id);
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

    public function store(StoreDocumentRequest $request): JsonResponse
    {
        try {
            $document = $this->documentService->createDocument($request->validated());
            return response()->json([
                'status' => 'success',
                'message' => 'Document created successfully',
                'data' => $document,
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(UpdateDocumentRequest $request, Document $document): JsonResponse
    {
        try {
            $updated = $this->documentService->updateDocument($document->id, $request->validated());
            return response()->json([
                'status' => 'success',
                'message' => 'Document updated successfully',
                'data' => $updated,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Document $document): JsonResponse
    {
        try {
            $this->documentService->deleteDocument($document->id);
            return response()->json([
                'status' => 'success',
                'message' => 'Document deleted successfully',
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}