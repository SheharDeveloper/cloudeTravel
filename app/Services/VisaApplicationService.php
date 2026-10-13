<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\ApplicationForm;
use App\Models\ApplicationFormLog;
use App\Models\BookingApplication;
use App\Models\Client;
use App\Models\ServiceBooking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Visa applications (one per passenger of a visa booking): who may see or
 * change them, "Send to Admin", and the application lists.
 *
 * - An agency (or the superadmin) works on the applications of its own bookings.
 * - An agency sends a submitted application to the admin. If the agency
 *   changes it afterwards, it has to be resent.
 * - The superadmin sees (and can update) every application agencies have
 *   sent (Agency Applications).
 * - Every change to a submitted form is logged (Visa Updation Log Data).
 */
class VisaApplicationService
{
    public function __construct(
        protected ContactInfoService $contactInfoService,
        protected ApplicationFormService $formService,
    ) {
    }

    // ─── Finding applications ────────────────────────────────────────────────

    /** An application of one of the current owner's bookings (to change it). */
    public function findOwned(string $uid): BookingApplication
    {
        return BookingApplication::where('uid', $uid)
            ->whereHas('booking', fn ($b) => $b->whereIn('id', $this->ownedBookings()->select('id')))
            ->firstOrFail();
    }

    /** The owner's own application, or — for the superadmin — any application an agency sent to the admin. */
    public function findViewable(string $uid): BookingApplication
    {
        return BookingApplication::where('uid', $uid)
            ->where(function (Builder $q) {
                $q->whereHas('booking', fn ($b) => $b->whereIn('id', $this->ownedBookings()->select('id')));
                if ($this->isSuperadmin()) {
                    $q->orWhereNotNull('sent_to_admin_at');
                }
            })
            ->firstOrFail();
    }

    /** One of the client's own applications (client portal): a visa booking of theirs, past pending. */
    public function findForClient(Client $client, string $uid): BookingApplication
    {
        return BookingApplication::where('uid', $uid)
            ->whereHas('booking', fn ($b) => $b->whereIn('id', $this->clientBookings($client)->select('id')))
            ->firstOrFail();
    }

    public function isOwner(BookingApplication $application): bool
    {
        return $this->ownedBookings()->whereKey($application->service_booking_id)->exists();
    }

    public function isSuperadmin(): bool
    {
        return (bool) Auth::guard('web')->user()?->hasRole('superadmin');
    }

    // ─── Send to Admin ───────────────────────────────────────────────────────

    /**
     * What the viewer may do with the application:
     * - can_edit: fill / update the form (the agency, and the superadmin on sent applications)
     * - can_send: Send to Admin — an agency's own application, not sent yet,
     *   or changed by the agency since it was sent (Resend)
     * - admin_view: the superadmin looking at an agency's sent application
     */
    public function access(BookingApplication $application): array
    {
        $application->loadMissing('booking.owner');
        $isOwner = $this->isOwner($application);
        $needsSending = ! $application->sent_to_admin_at || $application->updated_after_send_at;

        return [
            'can_edit' => true,
            'can_send' => $isOwner && $needsSending && $application->booking->owner instanceof Agency,
            'admin_view' => ! $isOwner,
        ];
    }

    /** When and by which agency the application was sent (and whether it changed since), or null. */
    public function sentInfo(BookingApplication $application): ?array
    {
        if (! $application->sent_to_admin_at) {
            return null;
        }
        $application->loadMissing('booking.owner');

        return [
            'at' => $application->sent_to_admin_at->toIso8601String(),
            'agency' => $application->booking->owner instanceof Agency ? $application->booking->owner->agency_name : null,
            'updated_at' => $application->updated_after_send_at?->toIso8601String(),
        ];
    }

    /**
     * Saves the application form, as the agency or the admin. Changes to a
     * submitted form are logged; when the agency changes an application it
     * already sent, it has to be resent to the admin.
     */
    public function saveForm(BookingApplication $application, array $answers, bool $submit, ?object $actor, ?string $role = null): ApplicationForm
    {
        // The client portal passes its own role; otherwise the agency or the admin
        $role ??= $this->isOwner($application) && ! $this->isSuperadmin()
            ? ApplicationFormLog::ROLE_AGENCY
            : ApplicationFormLog::ROLE_ADMIN;

        $form = $this->formService->save($application, $answers, $submit, $actor, $role);

        // A change by the agency's side (the agency or its client) means it has to be resent
        $agencySide = in_array($role, [ApplicationFormLog::ROLE_AGENCY, ApplicationFormLog::ROLE_CLIENT], true);
        if ($agencySide && $application->sent_to_admin_at && $form->newLogs->isNotEmpty()) {
            $application->update(['updated_after_send_at' => now()]);
        }

        return $form;
    }

    /** The statuses the superadmin can set on an application (Processing). */
    public const STATUSES = [
        'submitted' => 'Submitted',
        'in_process' => 'In Process',
        'update_done' => 'Update Done',
        'approved' => 'Approved',
        'rejected' => 'Rejected',
    ];

    /**
     * Processing: the superadmin moves the application to another status,
     * with a comment (required for Rejected: the reason). The change is
     * recorded in the Visa Updation Log (old → new status, and the comment).
     */
    public function changeStatus(BookingApplication $application, string $status, ?object $actor, ?string $comment = null): BookingApplication
    {
        $old = $application->status;
        $comment = trim((string) $comment) ?: null;
        if ($status === 'rejected' && ! $comment) {
            throw ValidationException::withMessages(['comment' => 'Enter the reason for rejecting the application.']);
        }
        if ($old === $status && ! $comment) {
            return $application;
        }

        DB::transaction(function () use ($application, $status, $old, $actor, $comment) {
            $application->update(['status' => $status]);
            $application->formLogs()->create([
                'field_name' => 'Application Status',
                'old_value' => self::STATUSES[$old] ?? ucfirst(str_replace('_', ' ', (string) $old)),
                'new_value' => self::STATUSES[$status],
                'comment' => $comment,
                'changed_by_role' => ApplicationFormLog::ROLE_ADMIN,
                'changed_by_type' => $actor ? get_class($actor) : null,
                'changed_by_id' => $actor?->id,
            ]);
        });

        return $application;
    }

    /** Visa Updation Log Data: every logged change to the form, newest first. */
    public function logs(BookingApplication $application): array
    {
        return $application->formLogs()->get()->map(fn (ApplicationFormLog $log) => [
            'id' => $log->id,
            'application_number' => $application->application_number,
            'field_name' => $log->field_name,
            'section_name' => $log->section_name,
            'old_value' => $log->old_value,
            'new_value' => $log->new_value,
            'comment' => $log->comment,
            'role' => $log->changed_by_role,
            'created_at' => $log->created_at?->toIso8601String(),
        ])->all();
    }

    /**
     * Hands an agency's application to the superadmin — or hands it over again
     * after the agency changed it. Its form has to be submitted first.
     */
    public function sendToAdmin(BookingApplication $application, ?object $actor): BookingApplication
    {
        $application->loadMissing('booking.owner', 'form');

        if ($application->sent_to_admin_at && ! $application->updated_after_send_at) {
            throw ValidationException::withMessages(['application' => 'This application has already been sent to the admin.']);
        }
        if (! $application->booking->owner instanceof Agency) {
            throw ValidationException::withMessages(['application' => 'Only an agency can send an application to the admin.']);
        }
        if ($application->form?->status !== ApplicationForm::STATUS_SUBMITTED) {
            throw ValidationException::withMessages(['application' => 'Submit the application form before sending it to the admin.']);
        }

        $application->update([
            'sent_to_admin_at' => now(),
            'sent_by_type' => $actor ? get_class($actor) : null,
            'sent_by_id' => $actor?->id,
            'updated_after_send_at' => null,
            'status' => 'submitted',
        ]);

        return $application;
    }

    // ─── Lists ───────────────────────────────────────────────────────────────

    /** Visa Applications: the owner's applications of visa bookings past pending. */
    public function visaApplications(string $search): LengthAwarePaginator
    {
        return $this->search(
            BookingApplication::query()->whereHas('booking', fn ($b) => $b
                ->whereIn('id', $this->ownedBookings()->select('id'))
                ->where('service', 'visa')
                ->where('status', '!=', 'pending')),
            $search,
        )
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (BookingApplication $a) => $this->row($a));
    }

    /** Client portal "My Bookings": the client's own applications, laid out like Visa Applications. */
    public function clientApplications(Client $client, string $search): LengthAwarePaginator
    {
        return $this->search(
            BookingApplication::query()->whereHas('booking', fn ($b) => $b->whereIn('id', $this->clientBookings($client)->select('id'))),
            $search,
        )
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (BookingApplication $a) => $this->row($a));
    }

    /**
     * "View Application": the applicant, their booking and everyone else on
     * it — for the agency / superadmin page and the client portal alike.
     */
    public function details(BookingApplication $application): array
    {
        $application->loadMissing('booking.client:id,name,email,phone', 'booking.applications', 'booking.signature');
        $booking = $application->booking;
        $d = $booking->details ?? [];

        return [
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
                'client_email' => $booking->client?->email,
            ],
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
                ->values()
                ->all(),
        ];
    }

    /** Agency Applications (superadmin): every visa application an agency has sent to the admin, newest first. */
    public function agencyApplications(string $search): LengthAwarePaginator
    {
        $sentVisaApplications = BookingApplication::query()
            ->whereNotNull('sent_to_admin_at')
            ->whereHas('booking', fn ($b) => $b->where('service', 'visa'));

        return $this->search($sentVisaApplications, $search)
            ->latest('sent_to_admin_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (BookingApplication $a) => $this->row($a) + [
                'agency' => $a->booking->owner instanceof Agency ? $a->booking->owner->agency_name : null,
            ]);
    }

    /** Search by name, email, passport, invoice number or application number ("CLDACI00102" is #102). */
    private function search(Builder $query, string $search): Builder
    {
        $searchId = preg_match('/^CLDACI0*(\d+)$/i', $search, $m) ? (int) $m[1] : null;

        return $query
            ->with('booking:id,uid,invoice_number,client_id,owner_type,owner_id,currency_symbol,details,created_at,status', 'booking.client:id,name,email,phone', 'booking.owner')
            // Status changes (Processing), newest first: for the latest comment
            ->with(['formLogs' => fn ($l) => $l->where('field_name', 'Application Status')])
            // Document Status: how many documents were requested, and how many are uploaded
            ->withCount([
                'documents as documents_requested',
                'documents as documents_uploaded' => fn ($d) => $d->whereNotNull('file_path'),
            ])
            ->when($search !== '', function (Builder $q) use ($search, $searchId) {
                $q->where(function (Builder $q) use ($search, $searchId) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('passport_number', 'like', "%{$search}%")
                        ->orWhereHas('booking', fn ($b) => $b->where('invoice_number', 'like', "%{$search}%"))
                        ->when($searchId, fn ($q) => $q->orWhere('id', $searchId));
                });
            });
    }

    /** One row of the application lists. */
    private function row(BookingApplication $a): array
    {
        $booking = $a->booking;
        $d = $booking->details ?? [];

        return [
            'uid' => $a->uid,
            'application_number' => $a->application_number,
            'name' => trim("{$a->first_name} {$a->last_name}"),
            'relation' => $a->relation,
            // The applicant's own contact details, else the booking client's
            'email' => $a->email ?: $booking->client?->email,
            'phone' => $a->phone ?: $booking->client?->phone,
            'visa_name' => $d['visa_name'] ?? null,
            'visa_type' => $d['visa_type'] ?? null,
            'origin' => $d['origin'] ?? null,
            'destination' => $d['destination'] ?? null,
            'amount' => $a->amount,
            'currency_symbol' => $booking->currency_symbol,
            'booked_on' => $booking->created_at?->toIso8601String(),
            // "submitted" once every requested document is uploaded, otherwise "pending"
            'document_status' => $a->documents_requested > 0 && $a->documents_uploaded >= $a->documents_requested ? 'submitted' : 'pending',
            'documents_requested' => (int) $a->documents_requested,
            'documents_uploaded' => (int) $a->documents_uploaded,
            // The latest status comment (the reason, when rejected) and when the status last changed
            'status_comment' => $a->formLogs->first()?->comment,
            'status_updated_at' => $a->formLogs->first()?->created_at?->toIso8601String(),
            'status' => $a->status,
            'booking_uid' => $booking->uid,
            'invoice_number' => $booking->invoice_number,
            'sent_at' => $a->sent_to_admin_at?->toIso8601String(),
        ];
    }

    /** The client's visa bookings with their agency, past pending (as on the agency's Visa Applications). */
    private function clientBookings(Client $client): Builder
    {
        return ServiceBooking::where('client_id', $client->id)
            ->where('owner_type', $client->owner_type)
            ->where('owner_id', $client->owner_id)
            ->where('service', 'visa')
            ->where('status', '!=', 'pending');
    }

    /** The current agency's (or superadmin's) own bookings. */
    private function ownedBookings(): Builder
    {
        $owner = $this->contactInfoService->currentOwner();

        return ServiceBooking::where('owner_type', $owner ? get_class($owner) : null)
            ->where('owner_id', $owner?->id);
    }
}
