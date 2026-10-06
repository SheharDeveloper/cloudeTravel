<?php

namespace App\Services;

use App\Models\ApplicationDocument;
use App\Models\BookingApplication;
use App\Models\Client;
use App\Models\ClientDocument;
use App\Models\ClientFolder;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

/**
 * "Upload Document" on one visa application:
 * - the superadmin requests documents for the application (name, description,
 *   required);
 * - the agency sees the requests and uploads a file for each; the superadmin
 *   sees the files and can upload too;
 * - the superadmin approves each file (correct) or rejects it with the reason;
 *   a new upload goes back to waiting for review.
 * Files are private (local disk), one per request; uploading again replaces it.
 * A copy also goes into the booking client's Documents, in a folder named
 * after the visa.
 */
class ApplicationDocumentService
{
    public function __construct(protected ClientService $clientService)
    {
    }

    private const DISK = 'local';

    // A new (or removed) file has to be reviewed again
    private const NO_REVIEW = [
        'review_status' => null, 'review_note' => null,
        'reviewed_by_type' => null, 'reviewed_by_id' => null, 'reviewed_at' => null,
    ];

    /** The requested documents with their upload status, in order. */
    public function forApplication(BookingApplication $application): array
    {
        return $application->documents()->get()->map(fn (ApplicationDocument $d) => [
            'id' => $d->id,
            'name' => $d->name,
            'description' => $d->description,
            'is_required' => $d->is_required,
            'file' => $d->file_path ? [
                'name' => $d->file_name,
                'size' => $d->file_size,
                'mime_type' => $d->mime_type,
                'uploaded_at' => $d->uploaded_at?->toIso8601String(),
                'uploaded_by' => $d->uploaded_by_role,
            ] : null,
            // The superadmin's review of the file: approved / rejected (with why), or null while waiting
            'review' => $d->file_path && $d->review_status ? [
                'status' => $d->review_status,
                'note' => $d->review_note,
                'reviewed_at' => $d->reviewed_at?->toIso8601String(),
            ] : null,
        ])->all();
    }

    /**
     * The superadmin's review of an uploaded file: approved (the document is
     * correct) or rejected (not correct — the note says why, and the agency
     * uploads it again).
     */
    public function review(BookingApplication $application, int $documentId, string $status, ?string $note, ?object $actor): ApplicationDocument
    {
        $document = $this->find($application, $documentId);
        if (! $document->file_path) {
            throw ValidationException::withMessages(['review' => 'There is no uploaded file to review yet.']);
        }

        $document->update([
            'review_status' => $status,
            'review_note' => $status === ApplicationDocument::REVIEW_REJECTED ? trim((string) $note) : null,
            'reviewed_by_type' => $actor ? get_class($actor) : null,
            'reviewed_by_id' => $actor?->id,
            'reviewed_at' => now(),
        ]);

        return $document;
    }

    /**
     * Saves the complete list of requested documents in order: rows with an
     * id are updated, new rows are requested, and requests left out are
     * removed together with any file uploaded for them.
     *
     * @param  array<int, array{id?: int|null, name: string, description?: ?string, is_required?: bool}>  $rows
     */
    public function syncRequests(BookingApplication $application, array $rows, ?object $actor): void
    {
        DB::transaction(function () use ($application, $rows, $actor) {
            $keptIds = [];

            foreach (array_values($rows) as $order => $row) {
                $attributes = [
                    'name' => trim($row['name']),
                    'description' => ($d = trim((string) ($row['description'] ?? ''))) === '' ? null : $d,
                    'is_required' => (bool) ($row['is_required'] ?? false),
                    'sort_order' => $order,
                ];

                $document = ! empty($row['id']) ? $application->documents()->find($row['id']) : null;
                if ($document) {
                    $document->update($attributes);
                } else {
                    $document = $application->documents()->create($attributes + [
                        'requested_by_type' => $actor ? get_class($actor) : null,
                        'requested_by_id' => $actor?->id,
                    ]);
                }

                $keptIds[] = $document->id;
            }

            $application->documents()->whereNotIn('id', $keptIds)->get()->each(function (ApplicationDocument $removed) {
                $this->deleteStoredFile($removed);
                $removed->delete();
            });
        });
    }

    /** Stores the file for a requested document (replacing any earlier one). */
    public function upload(BookingApplication $application, int $documentId, UploadedFile $file, ?object $actor, string $role): ApplicationDocument
    {
        $document = $this->find($application, $documentId);
        $path = $file->store("application-documents/{$application->uid}", self::DISK);

        $this->deleteStoredFile($document);
        $document->update([
            'file_path' => $path,
            'file_name' => mb_substr($file->getClientOriginalName(), 0, 255),
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'uploaded_by_role' => $role,
            'uploaded_by_type' => $actor ? get_class($actor) : null,
            'uploaded_by_id' => $actor?->id,
            'uploaded_at' => now(),
        ] + self::NO_REVIEW);

        $this->copyToClient($application, $document);

        return $document;
    }

    /**
     * Saves a copy of the uploaded file in the booking client's Documents, in
     * a folder named after the visa (created the first time). The copy is
     * replaced or removed together with the application's file.
     */
    public function copyToClient(BookingApplication $application, ApplicationDocument $document): void
    {
        $application->loadMissing('booking.client');
        $client = $application->booking->client;
        if (! $client || ! $document->file_path || ! Storage::disk(self::DISK)->exists($document->file_path)) {
            return;
        }

        // The client's documents belong to the client's owner (the agency, or the superadmin)
        $owner = ['owner_type' => $client->owner_type, 'owner_id' => $client->owner_id];
        $folderName = trim((string) ($application->booking->details['visa_name'] ?? '')) ?: 'Visa Documents';
        $folder = ClientFolder::firstOrCreate(
            ['client_id' => $client->id, 'parent_id' => null, 'name' => $folderName],
            $owner,
        );

        // Same storage the client's own documents use (public disk, the client's folder)
        $this->clientService->ensureClientFolder($client);
        $extension = pathinfo($document->file_name, PATHINFO_EXTENSION) ?: pathinfo($document->file_path, PATHINFO_EXTENSION);
        $target = $this->clientService->clientFolderPath($client) . '/' . Str::random(40) . ($extension ? ".{$extension}" : '');
        Storage::disk('public')->writeStream($target, Storage::disk(self::DISK)->readStream($document->file_path));

        $applicant = trim("{$application->first_name} {$application->last_name}");
        $clientDocument = ClientDocument::create($owner + [
            'documentable_type' => Client::class,
            'documentable_id' => $client->id,
            'folder_id' => $folder->id,
            'document_name' => $document->name . ($applicant !== '' ? " - {$applicant}" : ''),
            'document_type' => 'Visa Document',
            'file_path' => '/storage/' . $target,
            'file_type' => $extension,
        ]);

        $document->update(['client_document_id' => $clientDocument->id]);
    }

    /** Removes the uploaded file; the request stays, waiting for a new upload. */
    public function removeFile(BookingApplication $application, int $documentId): void
    {
        $document = $this->find($application, $documentId);
        $this->deleteStoredFile($document);
        $document->update([
            'file_path' => null, 'file_name' => null, 'mime_type' => null, 'file_size' => null,
            'uploaded_by_role' => null, 'uploaded_by_type' => null, 'uploaded_by_id' => null, 'uploaded_at' => null,
            'client_document_id' => null,
        ] + self::NO_REVIEW);
    }

    /** The uploaded file, for viewing / downloading. */
    public function file(BookingApplication $application, int $documentId): ApplicationDocument
    {
        $document = $this->find($application, $documentId);
        abort_unless($document->file_path && Storage::disk(self::DISK)->exists($document->file_path), 404);

        return $document;
    }

    public function disk(): string
    {
        return self::DISK;
    }

    private function find(BookingApplication $application, int $documentId): ApplicationDocument
    {
        return $application->documents()->whereKey($documentId)->firstOrFail();
    }

    /** Deletes the uploaded file, and its copy in the client's Documents. */
    private function deleteStoredFile(ApplicationDocument $document): void
    {
        if ($document->file_path) {
            Storage::disk(self::DISK)->delete($document->file_path);
        }

        if ($document->client_document_id && ($copy = ClientDocument::find($document->client_document_id))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', (string) $copy->file_path));
            $copy->delete();
        }
        $document->client_document_id = null;
    }
}
