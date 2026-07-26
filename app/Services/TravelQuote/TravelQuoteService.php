<?php

namespace App\Services\TravelQuote;

use App\Models\TravelQuote;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class TravelQuoteService
{
    /**
     * Get all travel quotes with feedback
     */
    public function getAllQuotes()
    {
        return TravelQuote::with('feedback')->orderBy('created_at', 'desc')->get();
    }

    /**
     * Create a new travel quote
     */
    public function createQuote(array $data)
    {
        return TravelQuote::create($data);
    }

    /**
     * Get a single travel quote by UID
     */
    public function getQuoteByUid(string $uid)
    {
        return TravelQuote::where('uid', $uid)->with('feedback')->firstOrFail();
    }

    /**
     * Get public quote preview by UID (for sharing with customers)
     */
    public function getPublicQuotePreview(string $uid)
    {
        return TravelQuote::where('uid', $uid)->with('feedback')->firstOrFail();
    }

    /**
     * Update a travel quote
     */
    public function updateQuote(TravelQuote $travelQuote, array $data)
    {
        $travelQuote->update($data);
        return $travelQuote;
    }

    /**
     * Delete a travel quote
     */
    public function deleteQuote(TravelQuote $travelQuote)
    {
        return $travelQuote->delete();
    }

    /**
     * Upload single image and return path
     */
    public function uploadImage(UploadedFile $file)
    {
        $timestamp = now()->timestamp;
        $random = random_int(1000, 9999);
        $extension = $file->getClientOriginalExtension();

        $filename = "travel_quote_{$timestamp}_{$random}.{$extension}";
        $path = $file->storeAs('travel-quotes', $filename, 'public');

        return '/storage/' . $path;
    }

    /**
     * Upload multiple images for a travel quote
     */
    public function uploadImages(array $files)
    {
        $imagePaths = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $imagePaths[] = $this->uploadImage($file);
            }
        }

        return $imagePaths;
    }

    /**
     * Delete image from storage
     */
    public function deleteImage(string $imagePath)
    {
        $path = str_replace('/storage/', '', $imagePath);
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Delete all images when quote is deleted
     */
    public function deleteAllImages(array $imagePaths)
    {
        foreach ($imagePaths as $imagePath) {
            $this->deleteImage($imagePath);
        }
    }
}
