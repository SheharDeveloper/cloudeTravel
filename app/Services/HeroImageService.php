<?php

namespace App\Services;

use App\Models\HeroImage;
use Illuminate\Support\Facades\Storage;

class HeroImageService
{
    /**
     * Get all hero images
     * - If $status is provided, filter by that status value
     * - If $showAll is true and no status filter, show all
     * - Default: show status=1 only
     */
    public function getAll($status = null): array
    {
        $query = HeroImage::orderBy('order');

        // If status parameter is provided, filter by it
        if ($status !== null) {
            $query->where('status', $status);
        }

        return $query->get()->toArray();
    }

    /**
     * Get a single hero image by ID
     */
    public function getById(int $id): ?HeroImage
    {
        return HeroImage::find($id);
    }

    /**
     * Create a new hero image
     */
    public function create(array $data): HeroImage
    {
        // Store the uploaded file if present
        if (isset($data['image_url']) && is_object($data['image_url'])) {
            $file = $data['image_url'];
            $path = $file->store('hero-images', 'public');
            $data['image_url'] = Storage::url($path);
        }

        return HeroImage::create($data);
    }

    /**
     * Update a hero image
     */
    public function update(int $id, array $data): ?HeroImage
    {
        $image = HeroImage::find($id);
        if (!$image) {
            return null;
        }

        // Store the uploaded file if present
        if (isset($data['image_url']) && is_object($data['image_url'])) {
            // Delete old file if exists
            if ($image->image_url && strpos($image->image_url, 'storage/') !== false) {
                $oldPath = str_replace('/storage/', '', $image->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $file = $data['image_url'];
            $path = $file->store('hero-images', 'public');
            $data['image_url'] = Storage::url($path);
        } else {
            // If no file uploaded, remove image_url from update data (keep existing)
            unset($data['image_url']);
        }

        $image->update($data);
        return $image;
    }

    /**
     * Delete a hero image
     */
    public function delete(int $id): bool
    {
        $image = HeroImage::find($id);
        if (!$image) {
            return false;
        }

        // Delete the image file if it exists
        if ($image->image_url && strpos($image->image_url, 'storage/') !== false) {
            $oldPath = str_replace('/storage/', '', $image->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        // Delete the database record
        return $image->forceDelete() ? true : false;
    }
}
