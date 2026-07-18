<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DocumentDisplayController extends Controller
{
    public function show(string $filename): BinaryFileResponse
    {
        $path = 'documents/' . $filename;

        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'Document not found');
        }

        return response()->file(
            Storage::disk('public')->path($path),
            ['Content-Type' => 'application/pdf']
        );
    }
}
