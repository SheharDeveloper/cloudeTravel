<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class ContactRequestController extends Controller
{
    public function index(): JsonResponse
    {
        $perPage = request()->get('per_page', 15);
        $contacts = Contact::latest()->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $contacts->items(),
            'current_page' => $contacts->currentPage(),
            'per_page' => $contacts->perPage(),
            'total' => $contacts->total(),
            'last_page' => $contacts->lastPage(),
        ]);
    }

    public function show(Contact $contact): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $contact,
        ]);
    }

    public function destroy(Contact $contact): JsonResponse
    {
        try {
            $contact->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Contact request deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete contact request: ' . $e->getMessage(),
            ], 500);
        }
    }
}
