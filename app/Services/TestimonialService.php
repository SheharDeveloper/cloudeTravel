<?php

namespace App\Services;

use App\Models\Testimonial;
use Illuminate\Support\Facades\Storage;

class TestimonialService
{
    /**
     * Get all testimonials
     * - If $status is provided, filter by that status value
     * - If $showAll is true and no status filter, show all
     * - Default: show status=1 only
     */
    public function getAll(bool $showAll = false, $status = null): array
    {
        $query = Testimonial::orderBy('order');

        // If status parameter is provided, filter by it
        if ($status !== null) {
            $query->where('status', $status);
        } elseif (!$showAll) {
            // If no status specified and not showing all, default to status=1
            $query->where('status', 1);
        }

        return $query->get()->toArray();
    }

    /**
     * Get a single testimonial by ID
     */
    public function getById(int $id): ?Testimonial
    {
        return Testimonial::find($id);
    }

    /**
     * Create a new testimonial
     */
    public function create(array $data): Testimonial
    {
        // Store the uploaded file if present
        if (isset($data['client_image']) && is_object($data['client_image'])) {
            $file = $data['client_image'];
            $path = $file->store('testimonials', 'public');
            $data['client_image'] = Storage::url($path);
        }

        return Testimonial::create($data);
    }

    /**
     * Update a testimonial
     */
    public function update(int $id, array $data): ?Testimonial
    {
        $testimonial = Testimonial::find($id);
        if (!$testimonial) {
            return null;
        }

        // Store the uploaded file if present
        if (isset($data['client_image']) && is_object($data['client_image'])) {
            // Delete old file if exists
            if ($testimonial->client_image && strpos($testimonial->client_image, 'storage/') !== false) {
                $oldPath = str_replace('/storage/', '', $testimonial->client_image);
                Storage::disk('public')->delete($oldPath);
            }
            $file = $data['client_image'];
            $path = $file->store('testimonials', 'public');
            $data['client_image'] = Storage::url($path);
        } else {
            // If no file uploaded, remove client_image from update data (keep existing)
            unset($data['client_image']);
        }

        $testimonial->update($data);
        return $testimonial;
    }

    /**
     * Delete a testimonial
     */
    public function delete(int $id): bool
    {
        $testimonial = Testimonial::find($id);
        if (!$testimonial) {
            return false;
        }

        // Delete the image file if it exists
        if ($testimonial->client_image && strpos($testimonial->client_image, 'storage/') !== false) {
            $oldPath = str_replace('/storage/', '', $testimonial->client_image);
            Storage::disk('public')->delete($oldPath);
        }

        // Delete the database record
        return $testimonial->forceDelete() ? true : false;
    }
}
