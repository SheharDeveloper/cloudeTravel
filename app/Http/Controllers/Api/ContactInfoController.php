<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactInfo\ContactInfoRequest;
use App\Services\ContactInfoService;
use Illuminate\Http\JsonResponse;

class ContactInfoController extends Controller
{
    private ContactInfoService $contactInfoService;

    public function __construct(ContactInfoService $contactInfoService)
    {
        $this->contactInfoService = $contactInfoService;
    }

    /**
     * Get contact info (public endpoint)
     */
    public function index(): JsonResponse
    {
        $contact = $this->contactInfoService->getInfo();
        return response()->json($contact);
    }

    /**
     * Create or update contact info (protected)
     */
    public function store(ContactInfoRequest $request): JsonResponse
    {
        $contact = $this->contactInfoService->save($request->payload());
        return response()->json($contact, 201);
    }

    /**
     * Update contact info (protected)
     */
    public function update(ContactInfoRequest $request): JsonResponse
    {
        $contact = $this->contactInfoService->save($request->payload());
        return response()->json($contact);
    }
}
