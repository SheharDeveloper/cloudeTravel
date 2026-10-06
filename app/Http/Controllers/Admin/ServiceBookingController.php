<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceBooking;
use App\Services\ApplicationFormService;
use App\Services\ContactInfoService;
use App\Services\DocumentSignService;
use App\Services\VisaApplicationService;
use App\Services\ApplicationDocumentService;
use App\Services\VisaRequirementsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Bookings made from the admin side (visa, flight, hotel…), each with its
 * invoice number and one application per passenger. An agency sees only its
 * own; the superadmin only the ones it made itself.
 */
class ServiceBookingController extends Controller
{
    public function __construct(
        protected ContactInfoService $contactInfoService,
        protected VisaRequirementsService $requirementsService,
        protected DocumentSignService $signService,
        protected ApplicationFormService $formService,
        protected VisaApplicationService $applicationService,
        protected ApplicationDocumentService $documentService,
    ) {
    }

    public function index(Request $request)
    {
        $filters = [
            'service' => (string) $request->query('service', ''),
            'status' => (string) $request->query('status', ''),
            'search' => trim((string) $request->query('search', '')),
        ];

        // Visa Applications: every application (one per passenger) of the
        // owner's visa bookings past pending, not the bookings themselves
        if ($filters['service'] === 'visa' && $filters['status'] === 'not_pending') {
            return $this->visaApplications($filters);
        }

        $bookings = $this->owned()
            ->with('client:id,uid,name,email')
            ->withCount('applications')
            ->when($filters['service'] !== '', fn ($q) => $q->where('service', $filters['service']))
            // "not_pending" is what the Visa Applications page lists: everything past pending
            ->when($filters['status'] === 'not_pending', fn ($q) => $q->where('status', '!=', 'pending'))
            ->when(! in_array($filters['status'], ['', 'not_pending'], true), fn ($q) => $q->where('status', $filters['status']))
            ->when($filters['search'] !== '', function ($q) use ($filters) {
                $q->where(function ($q) use ($filters) {
                    $q->where('invoice_number', 'like', "%{$filters['search']}%")
                        ->orWhereHas('client', fn ($c) => $c->where('name', 'like', "%{$filters['search']}%"))
                        ->orWhereHas('applications', fn ($a) => $a
                            ->where('first_name', 'like', "%{$filters['search']}%")
                            ->orWhere('last_name', 'like', "%{$filters['search']}%"));
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/ServiceBookings/Index', [
            'bookings' => $bookings,
            'filters' => $filters,
        ]);
    }

    private function visaApplications(array $filters)
    {
        return Inertia::render('Admin/ServiceBookings/Applications', [
            'applications' => $this->applicationService->visaApplications($filters['search']),
            'filters' => $filters,
        ]);
    }

    /** Superadmin: every visa application agencies have sent to the admin. */
    public function agencyApplications(Request $request)
    {
        abort_unless($this->applicationService->isSuperadmin(), 403);
        $search = trim((string) $request->query('search', ''));

        return Inertia::render('Admin/ServiceBookings/Applications', [
            'applications' => $this->applicationService->agencyApplications($search),
            'filters' => ['service' => 'visa', 'status' => 'sent', 'search' => $search],
            'adminList' => true,
        ]);
    }

    /** "Send to Admin": an agency hands its submitted application to the superadmin. */
    public function sendToAdmin(string $uid)
    {
        $application = $this->applicationService->sendToAdmin(
            $this->applicationService->findOwned($uid),
            \Illuminate\Support\Facades\Auth::guard('agency')->user() ?? \Illuminate\Support\Facades\Auth::guard('web')->user(),
        );

        return back()->with('success', "Application {$application->application_number} sent to the admin.");
    }

    /**
     * One application ("View Application"): the applicant, their booking's
     * payment summary, and the others travelling on the same booking. The
     * superadmin can also open applications agencies have sent to the admin.
     */
    public function showApplication(string $uid)
    {
        $application = $this->applicationService->findViewable($uid);
        $application->load('booking.client:id,name,email,phone', 'booking.applications', 'booking.signature', 'booking.owner');
        $booking = $application->booking;
        $d = $booking->details ?? [];

        return Inertia::render('Admin/ServiceBookings/ApplicationShow', [
            'application' => [
                'uid' => $application->uid,
                'application_number' => $application->application_number,
                'first_name' => $application->first_name,
                'last_name' => $application->last_name,
                'relation' => $application->relation,
                'email' => $application->email ?: $booking->client?->email,
                'phone' => $application->phone ?: $booking->client?->phone,
                'passport_number' => $application->passport_number,
                'nationality' => $application->nationality,
                'status' => $application->status,
                'amount' => $application->amount,
            ],
            'booking' => [
                'uid' => $booking->uid,
                'invoice_number' => $booking->invoice_number,
                'status' => $booking->status,
                'created_at' => $booking->created_at?->toIso8601String(),
                'signed_at' => $booking->signature?->signed_at?->toIso8601String(),
                'service_date' => $booking->service_date?->toDateString(),
                'passengers' => $booking->passengers,
                'currency_symbol' => $booking->currency_symbol,
                'base_amount' => $booking->base_amount,
                'service_fee' => $booking->service_fee,
                'tax_amount' => $booking->tax_amount,
                'total_amount' => $booking->total_amount,
                'visa_name' => $d['visa_name'] ?? null,
                'visa_type' => $d['visa_type'] ?? null,
                'validity' => $d['validity'] ?? null,
                'processing_time' => $d['processing_time'] ?? null,
                'origin' => $d['origin'] ?? null,
                'destination' => $d['destination'] ?? null,
                'taxes' => $d['taxes'] ?? [],
                'client_name' => $booking->client?->name,
            ],
            // "Fill Application": the visa's configured sections and fields, and the answers so far
            'form' => $this->formService->formFor($application),
            // Send to Admin: what the viewer may do, and when it was sent
            'access' => $this->applicationService->access($application),
            'sent' => $this->applicationService->sentInfo($application),
            // Visa Updation Log Data: changes made to the submitted form
            'logs' => $this->applicationService->logs($application),
            // Upload Document: the requested documents and their files; the superadmin requests them
            'documents' => $this->documentService->forApplication($application),
            'canRequestDocuments' => $this->applicationService->isSuperadmin(),
            // Everyone else on the same booking
            'members' => $booking->applications
                ->reject(fn ($a) => $a->id === $application->id)
                ->map(fn ($a) => [
                    'uid' => $a->uid,
                    'application_number' => $a->application_number,
                    'name' => trim("{$a->first_name} {$a->last_name}"),
                    'relation' => $a->relation,
                    'passport_number' => $a->passport_number,
                    'nationality' => $a->nationality,
                    'status' => $a->status,
                ])
                ->values(),
        ]);
    }

    /** "Fill Application" file field: stores the file privately and returns the field's answer (JSON). */
    public function uploadFormFile(Request $request, string $uid)
    {
        $application = $this->applicationService->findViewable($uid);
        $request->validate([
            'file' => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,webp,doc,docx',
        ], [
            'file.max' => 'The file may not be larger than 10 MB.',
            'file.mimes' => 'Upload a PDF, image (JPG, PNG, WEBP) or Word document.',
        ]);

        return response()->json(['value' => $this->formService->storeFile($application, $request->file('file'))]);
    }

    /** Opens a file uploaded to this application's form. */
    public function downloadFormFile(Request $request, string $uid)
    {
        $application = $this->applicationService->findViewable($uid);
        $path = (string) $request->query('path', '');
        abort_unless($this->formService->ownsFile($application, $path), 404);

        $name = (string) $request->query('name', basename($path));

        return \Illuminate\Support\Facades\Storage::disk('local')->response($path, basename($name));
    }

    /** "Fill Application": save as a draft, or submit (required fields checked). */
    public function saveApplicationForm(Request $request, string $uid)
    {
        $application = $this->applicationService->findViewable($uid);

        $validated = $request->validate([
            'answers' => 'present|array',
            // Up to 20 000 for the children list; the service trims ordinary answers to 5 000
            'answers.*' => 'nullable|string|max:20000',
            'submit' => 'boolean',
            // Saved while moving between steps: no "saved" message
            'quiet' => 'boolean',
        ]);

        $submit = (bool) ($validated['submit'] ?? false);
        $actor = \Illuminate\Support\Facades\Auth::guard('agency')->user() ?? \Illuminate\Support\Facades\Auth::guard('web')->user();
        $this->applicationService->saveForm($application, $validated['answers'], $submit, $actor);

        if (! empty($validated['quiet'])) {
            return back();
        }

        return back()->with('success', $submit ? 'Application form submitted.' : 'Application form saved as a draft.');
    }

    public function show(string $uid)
    {
        $booking = $this->owned()
            ->with(['client:id,uid,name,email,phone', 'applications', 'signature'])
            ->where('uid', $uid)
            ->firstOrFail();

        $signature = $booking->signature;
        $booking->unsetRelation('signature');

        return Inertia::render('Admin/ServiceBookings/Show', [
            'booking' => $booking,
            // The "Doc Sign" request, once generated: its status and link
            'docSign' => $signature ? [
                'status' => $signature->isExpired() ? 'expired' : $signature->status,
                'url' => $this->signService->url($signature),
                'signer_name' => $signature->signer_name,
                'signer_email' => $signature->signer_email,
                'email_sent_at' => $signature->email_sent_at?->toIso8601String(),
                'expires_at' => $signature->expires_at?->toIso8601String(),
                'signed_at' => $signature->signed_at?->toIso8601String(),
                'invoice_url' => route('documents.invoice', $signature->signing_token),
            ] : null,
        ]);
    }

    /** "Generate Doc Sign": creates the signing request and emails the link to the client. */
    public function generateDocSign(string $uid)
    {
        $booking = $this->owned()->where('uid', $uid)->firstOrFail();
        $signature = $this->signService->generate($booking);

        return back()->with('success', $signature->signer_email
            ? "Signing link sent to {$signature->signer_email}."
            : 'Signing link created. There is no email address to send it to, so copy the URL and share it.');
    }

    /** "Resend Email": the same link again, with a fresh deadline. */
    public function resendDocSign(string $uid)
    {
        $booking = $this->owned()->with('signature')->where('uid', $uid)->firstOrFail();
        abort_unless($booking->signature, 404);

        $signature = $this->signService->resend($booking->signature);

        return back()->with('success', $signature->signer_email
            ? "Signing link sent again to {$signature->signer_email}."
            : 'The deadline has been renewed. There is no email address, so copy the URL and share it.');
    }

    /**
     * "Edit": the visa steps again from the first one (choosing countries),
     * filled in from this booking. Saving updates the same booking.
     */
    public function edit(string $uid)
    {
        $booking = $this->owned()->where('uid', $uid)->firstOrFail();
        abort_unless($booking->service === 'visa', 404);

        return redirect()->route('admin.visa-search', $this->requirementsService->editStartParams($booking));
    }

    public function update(Request $request, string $uid)
    {
        $booking = $this->owned()->where('uid', $uid)->firstOrFail();
        abort_unless($booking->service === 'visa', 404);

        $booking = $this->requirementsService->storeApplication($request, $booking);

        return redirect()->route('admin.service-bookings.show', $booking->uid)
            ->with('success', "Booking {$booking->invoice_number} updated.");
    }

    /**
     * Adds or edits the invoice remark. Only basic formatting is kept, and
     * the visible text may be at most 500 characters. Empty text clears it.
     */
    public function updateRemark(Request $request, string $uid)
    {
        $booking = $this->owned()->where('uid', $uid)->firstOrFail();
        $request->validate(['invoice_remark' => 'nullable|string|max:20000']);

        $html = $this->cleanRemark((string) $request->input('invoice_remark', ''));
        $text = trim(html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8'));

        if (mb_strlen($text) > ServiceBooking::REMARK_MAX_CHARS) {
            return back()->withErrors(['invoice_remark' => 'The remark can be at most ' . ServiceBooking::REMARK_MAX_CHARS . ' characters.']);
        }

        $booking->update(['invoice_remark' => $text === '' ? null : $html]);

        return back()->with('success', $text === '' ? 'Invoice remark removed.' : 'Invoice remark saved.');
    }

    /** Tags the remark editor produces; everything else is unwrapped to its text. */
    private const REMARK_TAGS = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ol', 'ul', 'li', 'a'];

    /**
     * The remark is shown as HTML, so it is rebuilt from an allow-list: other
     * tags are replaced by their text, and every attribute is dropped except
     * a link's href, which must be http(s) or mailto.
     */
    private function cleanRemark(string $html): string
    {
        if (trim(strip_tags($html)) === '') {
            return '';
        }

        $doc = new \DOMDocument();
        libxml_use_internal_errors(true);
        $doc->loadHTML('<?xml encoding="utf-8"?><div id="remark">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();

        $root = $doc->getElementById('remark');
        $this->cleanNode($root);

        $out = '';
        foreach ($root->childNodes as $child) {
            $out .= $doc->saveHTML($child);
        }

        // The editor saves every space as &nbsp;, which would stop the text wrapping
        return trim(str_replace(['&nbsp;', "\u{00A0}"], ' ', $out));
    }

    private function cleanNode(\DOMNode $node): void
    {
        foreach (iterator_to_array($node->childNodes) as $child) {
            if ($child instanceof \DOMComment) {
                $node->removeChild($child);
                continue;
            }
            if (! $child instanceof \DOMElement) {
                continue;
            }

            $tag = strtolower($child->tagName);
            if (in_array($tag, ['script', 'style', 'iframe', 'object', 'embed'], true)) {
                $node->removeChild($child);
                continue;
            }

            $this->cleanNode($child);

            // Pasted headings and blocks become paragraphs, so their text stays on its own line
            if (in_array($tag, ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'], true)) {
                $paragraph = $child->ownerDocument->createElement('p');
                while ($child->firstChild) {
                    $paragraph->appendChild($child->firstChild);
                }
                $node->replaceChild($paragraph, $child);
                continue;
            }

            if (! in_array($tag, self::REMARK_TAGS, true)) {
                // Keep what's inside, drop the tag itself
                while ($child->firstChild) {
                    $node->insertBefore($child->firstChild, $child);
                }
                $node->removeChild($child);
                continue;
            }

            $href = $tag === 'a' ? trim($child->getAttribute('href')) : '';
            // The editor marks bullet vs numbered items with data-list on <li>
            $listType = $tag === 'li' ? $child->getAttribute('data-list') : '';
            foreach (iterator_to_array($child->attributes) as $attribute) {
                $child->removeAttribute($attribute->name);
            }
            if (in_array($listType, ['bullet', 'ordered'], true)) {
                $child->setAttribute('data-list', $listType);
            }
            if ($tag === 'a') {
                if (preg_match('#^(https?://|mailto:)#i', $href)) {
                    $child->setAttribute('href', $href);
                    $child->setAttribute('target', '_blank');
                    $child->setAttribute('rel', 'noopener noreferrer');
                }
            }
        }
    }

    private function owned()
    {
        $owner = $this->contactInfoService->currentOwner();

        return ServiceBooking::where('owner_type', $owner ? get_class($owner) : null)
            ->where('owner_id', $owner?->id);
    }
}
