<?php

namespace App\Services;

use App\Mail\ReceivedDocumentNotice;
use App\Models\Agency;
use App\Models\Client;
use App\Models\ReceivedDocument;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

/**
 * Client Documents: the physical documents clients hand to the agency.
 * Add (received on, remarks), Return Document, Send Notification (email +
 * a notice on the client's portal) and Delete. An agency sees only its own;
 * the superadmin sees its own. Each client sees theirs on the client portal.
 */
class ReceivedDocumentService
{
    public function __construct(protected DocumentSignService $signService)
    {
    }

    /** The register, newest first, with search by client, phone, CID or document. */
    public function list(string $search = '', int $perPage = 10): LengthAwarePaginator
    {
        return ReceivedDocument::with('client:id,uid,cid,name,phone,email')
            ->where($this->ownerAttributes())
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('document_name', 'like', "%{$search}%")
                        ->orWhere('remarks', 'like', "%{$search}%")
                        ->orWhereHas('client', fn ($c) => $c->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%")
                            ->orWhere('cid', 'like', "%{$search}%"));
                });
            })
            ->orderByDesc('received_at')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (ReceivedDocument $d) => $this->row($d));
    }

    /** "Select Client": the current owner's clients. */
    public function clientOptions(): array
    {
        return Client::where($this->ownerAttributes())
            ->orderBy('name')
            ->get(['uid', 'cid', 'name', 'phone'])
            ->map(fn (Client $c) => ['uid' => $c->uid, 'cid' => $c->cid, 'name' => $c->name, 'phone' => $c->phone])
            ->all();
    }

    public function create(string $clientUid, string $documentName, string $receivedAt, ?string $remarks): ReceivedDocument
    {
        $client = Client::where($this->ownerAttributes())->where('uid', $clientUid)->firstOrFail();
        $actor = $this->actor();

        return ReceivedDocument::create($this->ownerAttributes() + [
            'client_id' => $client->id,
            'document_name' => $documentName,
            'received_at' => $receivedAt,
            'remarks' => $remarks,
            'created_by_type' => $actor ? get_class($actor) : null,
            'created_by_id' => $actor?->id,
        ]);
    }

    /** "Return Document": handed back to the client. */
    public function markReturned(ReceivedDocument $document, ?string $returnedAt = null, ?string $remarks = null): ReceivedDocument
    {
        if ($document->isReturned()) {
            throw ValidationException::withMessages(['document' => 'This document has already been returned.']);
        }
        $document->update(['returned_at' => $returnedAt ?: now(), 'return_remarks' => $remarks]);

        return $document;
    }

    /**
     * "Send Notification": emails the client (when they have an email) and
     * puts a notice on their Client Documents page in the portal.
     */
    public function notify(ReceivedDocument $document): bool
    {
        $document->loadMissing('client.owner');
        $client = $document->client;

        $emailed = false;
        if ($client->email) {
            Mail::to($client->email, $client->name)
                ->send(new ReceivedDocumentNotice($document, $this->signService->brandingFor($client->owner)));
            $emailed = true;
        }

        // The portal notice: shown to the client from notified_at
        $document->update([
            'notified_at' => now(),
            'notification_count' => $document->notification_count + 1,
        ]);

        return $emailed;
    }

    /** A returned document stays as the record of the return; only one still held can be deleted. */
    public function delete(ReceivedDocument $document): void
    {
        if ($document->isReturned()) {
            throw ValidationException::withMessages(['document' => 'A returned document cannot be deleted.']);
        }
        $document->delete();
    }

    public function find(string $uid): ReceivedDocument
    {
        return ReceivedDocument::where($this->ownerAttributes())->where('uid', $uid)->firstOrFail();
    }

    /** The client page (admin): this client's documents, with the same actions as the register. */
    public function listForClient(Client $client): array
    {
        return ReceivedDocument::with('client:id,uid,cid,name,phone,email')
            ->where($this->ownerAttributes())
            ->where('client_id', $client->id)
            ->orderByDesc('received_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (ReceivedDocument $d) => $this->row($d))
            ->all();
    }

    /** Client portal: the client's own documents, newest first. */
    public function forClient(Client $client): array
    {
        return ReceivedDocument::where('client_id', $client->id)
            ->orderByDesc('received_at')
            ->get()
            ->map(fn (ReceivedDocument $d) => [
                'uid' => $d->uid,
                'document_name' => $d->document_name,
                'received_at' => $this->wallClock($d->received_at),
                'remarks' => $d->remarks,
                'returned_at' => $this->wallClock($d->returned_at),
                'return_remarks' => $d->return_remarks,
                'notified_at' => $d->notified_at?->toIso8601String(),
            ])
            ->all();
    }

    private function row(ReceivedDocument $d): array
    {
        return [
            'uid' => $d->uid,
            'document_name' => $d->document_name,
            'received_at' => $this->wallClock($d->received_at),
            'remarks' => $d->remarks,
            'returned_at' => $this->wallClock($d->returned_at),
                'return_remarks' => $d->return_remarks,
            'notified_at' => $d->notified_at?->toIso8601String(),
            'notification_count' => $d->notification_count,
            'client' => $d->client ? [
                'uid' => $d->client->uid,
                'cid' => $d->client->cid,
                'name' => $d->client->name,
                'phone' => $d->client->phone,
                'has_email' => (bool) $d->client->email,
            ] : null,
        ];
    }

    /** A date and time as typed in the form (no timezone), so the browser shows it unchanged. */
    private function wallClock(?\DateTimeInterface $value): ?string
    {
        return $value?->format('Y-m-d\TH:i:s');
    }

    /** The signed-in agency, or the superadmin user (like the Clients list). */
    private function ownerAttributes(): array
    {
        $agency = Auth::guard('agency')->user()?->agency;

        return [
            'owner_type' => $agency ? Agency::class : User::class,
            'owner_id' => $agency ? $agency->id : Auth::guard('web')->id(),
        ];
    }

    private function actor(): ?object
    {
        return Auth::guard('agency')->user() ?? Auth::guard('web')->user();
    }
}
