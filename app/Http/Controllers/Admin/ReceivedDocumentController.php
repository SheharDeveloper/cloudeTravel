<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ReceivedDocumentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/** Client Documents: physical documents received from clients, until they're returned. */
class ReceivedDocumentController extends Controller
{
    public function __construct(protected ReceivedDocumentService $documents)
    {
    }

    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        return Inertia::render('Admin/ReceivedDocuments/Index', [
            'documents' => $this->documents->list($search),
            'clients' => $this->documents->clientOptions(),
            'filters' => ['search' => $search],
        ]);
    }

    /** "Add Document" */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_uid' => 'required|string',
            'document_name' => 'required|string|max:255',
            'received_at' => 'required|date',
            'remarks' => 'nullable|string|max:2000',
        ], [
            'client_uid.required' => 'Select the client.',
            'document_name.required' => 'Enter the document name.',
        ]);

        $this->documents->create($validated['client_uid'], $validated['document_name'], $validated['received_at'], $validated['remarks'] ?? null);

        return back()->with('success', 'Document added.');
    }

    /** "Return Document": handed back to the client. */
    public function returnDocument(Request $request, string $uid)
    {
        $validated = $request->validate([
            'returned_at' => 'nullable|date',
            'return_remarks' => 'nullable|string|max:2000',
        ]);
        $document = $this->documents->markReturned($this->documents->find($uid), $validated['returned_at'] ?? null, $validated['return_remarks'] ?? null);

        return back()->with('success', "\"{$document->document_name}\" marked as returned.");
    }

    /** "Send Notification": email + a notice on the client's portal. */
    public function notify(string $uid)
    {
        $emailed = $this->documents->notify($this->documents->find($uid));

        return back()->with('success', $emailed
            ? 'Notification emailed to the client and shown on their portal.'
            : 'The client has no email address, so the notice is shown on their portal only.');
    }

    public function destroy(string $uid)
    {
        $this->documents->delete($this->documents->find($uid));

        return back()->with('success', 'Document deleted.');
    }
}
