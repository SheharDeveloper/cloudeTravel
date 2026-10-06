<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewApplicationDocumentRequest;
use App\Http\Requests\UpdateApplicationDocumentsRequest;
use App\Models\ApplicationDocument;
use App\Services\ApplicationDocumentService;
use App\Services\VisaApplicationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

/** "Upload Document" on a visa application: the superadmin requests documents, the agency uploads them. */
class ApplicationDocumentController extends Controller
{
    public function __construct(
        protected VisaApplicationService $applicationService,
        protected ApplicationDocumentService $documentService,
    ) {
    }

    /** Superadmin: saves the documents requested for the application. */
    public function update(UpdateApplicationDocumentsRequest $request, string $uid)
    {
        $this->documentService->syncRequests(
            $this->applicationService->findViewable($uid),
            $request->validated()['documents'],
            Auth::guard('web')->user(),
        );

        return back()->with('success', 'Requested documents saved.');
    }

    /** Agency or superadmin: uploads the file for a requested document. */
    public function upload(Request $request, string $uid, int $document)
    {
        $application = $this->applicationService->findViewable($uid);
        $request->validate([
            'file' => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,webp,doc,docx',
        ], [
            'file.max' => 'The file may not be larger than 10 MB.',
            'file.mimes' => 'Upload a PDF, image (JPG, PNG, WEBP) or Word document.',
        ]);

        $this->documentService->upload(
            $application,
            $document,
            $request->file('file'),
            Auth::guard('agency')->user() ?? Auth::guard('web')->user(),
            $this->applicationService->isSuperadmin() ? ApplicationDocument::ROLE_ADMIN : ApplicationDocument::ROLE_AGENCY,
        );

        return back()->with('success', 'Document uploaded.');
    }

    /** Superadmin: approves an uploaded document (correct) or rejects it (not correct, with the reason). */
    public function review(ReviewApplicationDocumentRequest $request, string $uid, int $document)
    {
        $validated = $request->validated();
        $this->documentService->review(
            $this->applicationService->findViewable($uid),
            $document,
            $validated['status'],
            $validated['note'] ?? null,
            Auth::guard('web')->user(),
        );

        return back()->with('success', $validated['status'] === ApplicationDocument::REVIEW_APPROVED ? 'Document approved.' : 'Document rejected.');
    }

    /** Superadmin only: removes an uploaded file (the request stays). The agency replaces files instead. */
    public function removeFile(string $uid, int $document)
    {
        abort_unless($this->applicationService->isSuperadmin(), 403);

        $this->documentService->removeFile($this->applicationService->findViewable($uid), $document);

        return back()->with('success', 'Uploaded file removed.');
    }

    /** Opens the uploaded file. */
    public function file(string $uid, int $document)
    {
        $file = $this->documentService->file($this->applicationService->findViewable($uid), $document);

        return Storage::disk($this->documentService->disk())->response($file->file_path, $file->file_name);
    }
}
