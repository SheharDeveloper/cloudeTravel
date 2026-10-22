<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ApplicationDocument;
use App\Models\ApplicationFormLog;
use App\Services\ApplicationDocumentService;
use App\Services\ApplicationFormService;
use App\Services\ClientPortalService;
use App\Services\DocumentSignService;
use App\Services\VisaApplicationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/** The signed-in client's own pages, on their agency's domain. */
class ClientPortalController extends Controller
{
    public function __construct(protected ClientPortalService $portal)
    {
    }

    /** My Profile */
    public function profile(Request $request)
    {
        $client = $this->portal->currentClient($request);

        return Inertia::render('Client/Profile', $this->layout($request) + [
            'profile' => $this->portal->profile($client),
        ]);
    }

    /** Profile Settings: edit the profile and change the password, on one page */
    public function settings(Request $request)
    {
        return Inertia::render('Client/Settings', $this->layout($request) + [
            'profile' => $this->portal->profile($this->portal->currentClient($request)),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'nationality' => 'nullable|string|max:100',
            'gender' => 'nullable|in:male,female,other',
            'dob' => \App\Services\ClientService::dobRules(), // 18+ only
            'address' => 'nullable|array',
            'address.address' => 'nullable|string|max:500',
            'address.city' => 'nullable|string|max:255',
            'address.state' => 'nullable|string|max:255',
            'address.country' => 'nullable|string|max:255',
            'address.zip_code' => 'nullable|string|max:20',
        ]);

        $this->portal->updateProfile($this->portal->currentClient($request), $validated);

        return back()->with('success', 'Your profile has been updated.');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|max:100|confirmed',
        ]);

        $this->portal->changePassword($this->portal->currentClient($request), $validated['current_password'], $validated['password']);

        return back()->with('success', 'Your password has been changed.');
    }

    /** My Bookings: the client's visa applications, laid out like the agency's Visa Applications */
    public function bookings(Request $request, VisaApplicationService $applications)
    {
        $search = trim((string) $request->query('search', ''));

        return Inertia::render('Client/Bookings', $this->layout($request) + [
            'applications' => $applications->clientApplications($this->portal->currentClient($request), $search),
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * View Application: the same page as the agency's — without Send to Admin,
     * Send Email or the log. The client fills the form and uploads documents.
     */
    public function application(Request $request, string $uid, VisaApplicationService $applications, ApplicationFormService $forms, ApplicationDocumentService $documents)
    {
        $application = $applications->findForClient($this->portal->currentClient($request), $uid);

        return Inertia::render('Client/ApplicationShow', $this->layout($request) + $applications->details($application) + [
            'form' => $forms->formFor($application),
            'documents' => $documents->forApplication($application),
        ]);
    }

    /** "Fill Application": save as a draft, or submit (required fields checked). */
    public function saveApplicationForm(Request $request, string $uid, VisaApplicationService $applications)
    {
        $client = $this->portal->currentClient($request);
        $application = $applications->findForClient($client, $uid);

        $validated = $request->validate([
            'answers' => 'present|array',
            'answers.*' => 'nullable|string|max:20000',
            'submit' => 'boolean',
            'quiet' => 'boolean',
        ]);

        $submit = (bool) ($validated['submit'] ?? false);
        $applications->saveForm($application, $validated['answers'], $submit, $client, ApplicationFormLog::ROLE_CLIENT);

        if (! empty($validated['quiet'])) {
            return back();
        }

        return back()->with('success', $submit ? 'Application form submitted.' : 'Application form saved as a draft.');
    }

    /** "Fill Application" file field: stores the file privately and returns the field's answer (JSON). */
    public function uploadApplicationFormFile(Request $request, string $uid, VisaApplicationService $applications, ApplicationFormService $forms)
    {
        $application = $applications->findForClient($this->portal->currentClient($request), $uid);
        $request->validate([
            'file' => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,webp,doc,docx',
        ], [
            'file.max' => 'The file may not be larger than 10 MB.',
            'file.mimes' => 'Upload a PDF, image (JPG, PNG, WEBP) or Word document.',
        ]);

        return response()->json(['value' => $forms->storeFile($application, $request->file('file'))]);
    }

    /** Opens a file uploaded to the application's form. */
    public function applicationFormFile(Request $request, string $uid, VisaApplicationService $applications, ApplicationFormService $forms)
    {
        $application = $applications->findForClient($this->portal->currentClient($request), $uid);
        $path = (string) $request->query('path', '');
        abort_unless($forms->ownsFile($application, $path), 404);

        return Storage::disk('local')->response($path, basename((string) $request->query('name', basename($path))));
    }

    /** "Upload Document": the client uploads the file for a requested document. */
    public function uploadApplicationDocument(Request $request, string $uid, int $document, VisaApplicationService $applications, ApplicationDocumentService $documents)
    {
        $client = $this->portal->currentClient($request);
        $application = $applications->findForClient($client, $uid);
        $request->validate([
            'file' => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,webp,doc,docx',
        ], [
            'file.max' => 'The file may not be larger than 10 MB.',
            'file.mimes' => 'Upload a PDF, image (JPG, PNG, WEBP) or Word document.',
        ]);

        $documents->upload($application, $document, $request->file('file'), $client, ApplicationDocument::ROLE_CLIENT);

        return back()->with('success', 'Document uploaded.');
    }

    /** Opens an uploaded document file. */
    public function applicationDocumentFile(Request $request, string $uid, int $document, VisaApplicationService $applications, ApplicationDocumentService $documents)
    {
        $file = $documents->file($applications->findForClient($this->portal->currentClient($request), $uid), $document);

        return Storage::disk($documents->disk())->response($file->file_path, $file->file_name);
    }

    /** My Documents: what the agency received from the client, returned or not, with any notice */
    public function documents(Request $request, \App\Services\ReceivedDocumentService $documents)
    {
        return Inertia::render('Client/Documents', $this->layout($request) + [
            'documents' => $documents->forClient($this->portal->currentClient($request)),
        ]);
    }

    /** Invoices */
    public function invoices(Request $request, DocumentSignService $signService)
    {
        return Inertia::render('Client/Invoices', $this->layout($request) + [
            'invoices' => $this->portal->invoices($this->portal->currentClient($request), $signService),
        ]);
    }

    /** One invoice, printable — the same invoice the agency sends for signing */
    public function invoice(Request $request, string $uid, DocumentSignService $signService)
    {
        $booking = $this->portal->findBooking($this->portal->currentClient($request), $uid);

        return view('documents.invoice', $signService->invoiceData($booking) + ['forClient' => true]);
    }

    public function logout(Request $request)
    {
        $this->portal->logout($request);

        return redirect()->route('agency.client-login');
    }

    /** What every client page's layout shows: the agency's branding and the client's name. */
    private function layout(Request $request): array
    {
        $agency = $this->portal->agencyFor($request);
        $client = $this->portal->currentClient($request);

        return [
            'portal' => [
                'agencyName' => $agency?->agency_name,
                'logo' => $agency?->logo,
                'clientName' => $client?->name,
                'clientEmail' => $client?->email,
            ],
        ];
    }
}
