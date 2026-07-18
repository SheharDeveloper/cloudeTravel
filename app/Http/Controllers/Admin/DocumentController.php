<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PublicDocument;
use App\Services\DocumentService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    private DocumentService $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    public function index(): Response
    {
        $documents = PublicDocument::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Documents/Index', [
            'documents' => $documents,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'document_file' => ['required', 'file', 'mimes:pdf', 'max:10240'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        try {
            $this->documentService->uploadDocument(
                $validated['document_file'],
                $validated['title'],
                $validated['status']
            );

            return back()->with('success', 'Document uploaded successfully!');
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['document_file' => $e->getMessage()]);
        }
    }

    public function update(Request $request, PublicDocument $publicDocument): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'document_file' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        try {
            if ($request->hasFile('document_file')) {
                $this->documentService->deleteDocument($publicDocument);
                $this->documentService->uploadDocument(
                    $validated['document_file'],
                    $validated['title'],
                    $validated['status']
                );
            } else {
                $publicDocument->update([
                    'title' => $validated['title'],
                    'status' => $validated['status'],
                ]);
            }

            return back()->with('success', 'Document updated successfully!');
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['document_file' => $e->getMessage()]);
        }
    }

    public function destroy(PublicDocument $publicDocument): RedirectResponse
    {
        $this->documentService->deleteDocument($publicDocument);

        return back()->with('success', 'Document deleted successfully!');
    }
}
