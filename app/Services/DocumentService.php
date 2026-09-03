<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\AgencyUser;
use App\Models\PublicDocument;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DocumentService
{
    public const DOCUMENTS_DISK = 'public';
    public const DOCUMENTS_PATH = 'documents';
    public const ALLOWED_MIMES = ['application/pdf'];
    public const MAX_FILE_SIZE = 10240;

    /**
     * Whoever is signed in right now (agency staff or superadmin), or null
     * for an anonymous visitor on the public site.
     */
    public function currentOwner(): Agency|User|null
    {
        $agencyUser = Auth::guard('agency')->user();
        if ($agencyUser instanceof AgencyUser) {
            return $agencyUser->agency;
        }

        return Auth::guard('web')->user();
    }

    /**
     * The agency that owns the domain a visitor is currently on.
     */
    private function viewingAgency(): ?Agency
    {
        $tenant = request()->attributes->get('tenant');

        return $tenant ? Agency::where('tenant_id', $tenant->id)->first() : null;
    }

    public function uploadDocument(UploadedFile $file, string $title, string $status = 'active'): PublicDocument
    {
        $this->validateFile($file);

        $fileName = $this->generateFileName($file);
        $filePath = $file->storeAs(self::DOCUMENTS_PATH, $fileName, self::DOCUMENTS_DISK);

        $data = [
            'title' => $title,
            'document_path' => '/' . $filePath,
            'status' => $status,
        ];

        if ($owner = $this->currentOwner()) {
            $data['owner_type'] = get_class($owner);
            $data['owner_id'] = $owner->id;
        }

        return PublicDocument::create($data);
    }

    /**
     * A document may only be managed by its own owner.
     */
    public function authorizeOwner(PublicDocument $document): void
    {
        $owner = $this->currentOwner();

        if (!$owner || $document->owner_type !== get_class($owner) || (int) $document->owner_id !== (int) $owner->id) {
            throw new AuthorizationException('You are not allowed to manage this document.');
        }
    }

    public function deleteDocument(PublicDocument $document): bool
    {
        $this->authorizeOwner($document);

        $path = ltrim($document->document_path, '/');

        if (Storage::disk(self::DOCUMENTS_DISK)->exists($path)) {
            Storage::disk(self::DOCUMENTS_DISK)->delete($path);
        }

        return $document->delete();
    }

    /**
     * All documents belonging to the current admin session (this agency's
     * own, or the superadmin's own global/default set).
     */
    public function getAllForAdmin()
    {
        $query = PublicDocument::orderBy('created_at', 'desc');

        if ($owner = $this->currentOwner()) {
            $query->where('owner_type', get_class($owner))->where('owner_id', $owner->id);
        }

        return $query->get();
    }

    /**
     * Active documents for the viewing agency's domain, falling back to the
     * global/default set if it has none of its own.
     */
    public function getActiveDocuments()
    {
        $query = PublicDocument::where('status', 'active');

        if (($agency = $this->viewingAgency()) && PublicDocument::where('owner_type', Agency::class)->where('owner_id', $agency->id)->exists()) {
            $query->where('owner_type', Agency::class)->where('owner_id', $agency->id);
        } else {
            $query->where('owner_type', User::class);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    private function validateFile(UploadedFile $file): void
    {
        if (!in_array($file->getMimeType(), self::ALLOWED_MIMES)) {
            throw new \InvalidArgumentException('Only PDF files are allowed.');
        }

        if ($file->getSize() / 1024 > self::MAX_FILE_SIZE) {
            throw new \InvalidArgumentException('File size must not exceed ' . (self::MAX_FILE_SIZE / 1024) . 'MB.');
        }
    }

    private function generateFileName(UploadedFile $file): string
    {
        $timestamp = now()->timestamp;
        $random = random_int(1000, 9999);
        $extension = $file->getClientOriginalExtension();

        return "document_{$timestamp}_{$random}.{$extension}";
    }
}
