<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\AgencyUser;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TestimonialService
{
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

    /**
     * Get testimonials.
     * - Signed in (admin context): only this agency's own testimonials (or
     *   the superadmin's own, for the global/default set).
     * - Anonymous (public site): only the viewing agency's own testimonials
     *   — no fallback to the global set, so an agency never shows another
     *   business's customer reviews as if they were its own.
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

        if ($owner = $this->currentOwner()) {
            $query->where('owner_type', get_class($owner))->where('owner_id', $owner->id);
        } elseif ($agency = $this->viewingAgency()) {
            $query->where('owner_type', Agency::class)->where('owner_id', $agency->id);
        } else {
            $query->where('owner_type', User::class);
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
        if ($owner = $this->currentOwner()) {
            $data['owner_type'] = get_class($owner);
            $data['owner_id'] = $owner->id;
        }

        // Store the uploaded file if present
        if (isset($data['client_image']) && is_object($data['client_image'])) {
            $file = $data['client_image'];
            $path = $file->store('testimonials', 'public');
            $data['client_image'] = Storage::url($path);
        }

        return Testimonial::create($data);
    }

    /**
     * A testimonial may only be managed by its own owner.
     */
    private function authorizeOwner(Testimonial $testimonial): void
    {
        $owner = $this->currentOwner();

        if (!$owner || $testimonial->owner_type !== get_class($owner) || (int) $testimonial->owner_id !== (int) $owner->id) {
            throw new AuthorizationException('You are not allowed to manage this testimonial.');
        }
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

        $this->authorizeOwner($testimonial);

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

        $this->authorizeOwner($testimonial);

        // Delete the image file if it exists
        if ($testimonial->client_image && strpos($testimonial->client_image, 'storage/') !== false) {
            $oldPath = str_replace('/storage/', '', $testimonial->client_image);
            Storage::disk('public')->delete($oldPath);
        }

        // Delete the database record
        return $testimonial->forceDelete() ? true : false;
    }
}
