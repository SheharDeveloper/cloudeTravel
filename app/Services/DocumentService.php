<?php

namespace App\Services;

use App\Models\PublicDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class DocumentService
{
    public const DOCUMENTS_DISK = 'public';
    public const DOCUMENTS_PATH = 'documents';
    public const ALLOWED_MIMES = ['application/pdf'];
    public const MAX_FILE_SIZE = 10240;

    public function uploadDocument(UploadedFile $file, string $title, string $status = 'active'): PublicDocument
    {
        $this->validateFile($file);

        $fileName = $this->generateFileName($file);
        $filePath = $file->storeAs(self::DOCUMENTS_PATH, $fileName, self::DOCUMENTS_DISK);

        return PublicDocument::create([
            'title' => $title,
            'document_path' => '/' . $filePath,
            'status' => $status,
        ]);
    }

    public function deleteDocument(PublicDocument $document): bool
    {
        $path = ltrim($document->document_path, '/');

        if (Storage::disk(self::DOCUMENTS_DISK)->exists($path)) {
            Storage::disk(self::DOCUMENTS_DISK)->delete($path);
        }

        return $document->delete();
    }

    public function getActiveDocuments()
    {
        return PublicDocument::where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();
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
