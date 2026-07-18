<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PublicDocument;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PublicDocumentController extends Controller
{
    public function index(): JsonResponse
    {
        $documents = PublicDocument::where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $documents,
        ]);
    }
}
