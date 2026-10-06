<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\ApplicationForm;
use App\Models\ApplicationFormLog;
use App\Models\BookingApplication;
use App\Models\ServiceBooking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
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
    public function saveForm(BookingApplication $application, array $answers, bool $submit, ?object $actor): ApplicationForm
    {
        $role = $this->isOwner($application) && ! $this->isSuperadmin()
            ? ApplicationFormLog::ROLE_AGENCY
            : ApplicationFormLog::ROLE_ADMIN;

        $form = $this->formService->save($application, $answers, $submit, $actor, $role);

        if ($role === ApplicationFormLog::ROLE_AGENCY && $application->sent_to_admin_at && $form->newLogs->isNotEmpty()) {
            $application->update(['updated_after_send_at' => now()]);
        }

        return $form;
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
            'document_status' => 'pending',
            'status' => $a->status,
            'booking_uid' => $booking->uid,
            'invoice_number' => $booking->invoice_number,
            'sent_at' => $a->sent_to_admin_at?->toIso8601String(),
        ];
    }

    /** The current agency's (or superadmin's) own bookings. */
    private function ownedBookings(): Builder
    {
        $owner = $this->contactInfoService->currentOwner();

        return ServiceBooking::where('owner_type', $owner ? get_class($owner) : null)
            ->where('owner_id', $owner?->id);
    }
}
