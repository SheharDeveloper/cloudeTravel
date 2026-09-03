<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\AgencyUser;
use App\Models\HeroImage;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class HeroImageService
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
     * The agency that owns the domain a visitor is currently on, resolved
     * from the tenant the ResolveTenantFromDomain middleware attached to
     * the request.
     */
    private function viewingAgency(): ?Agency
    {
        $tenant = request()->attributes->get('tenant');

        return $tenant ? Agency::where('tenant_id', $tenant->id)->first() : null;
    }

    /**
     * Get hero images.
     * - Signed in (admin context): only this agency's own images (or the
     *   superadmin's own, for the global/default set).
     * - Anonymous (public site): only the viewing agency's own images — no
     *   fallback to the global set, so an agency's homepage stays empty
     *   (not branded with someone else's photos) until it uploads its own.
     */
    public function getAll($status = null): array
    {
        $query = HeroImage::orderBy('order');

        if ($status !== null) {
            $query->where('status', $status);
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
        if ($owner = $this->currentOwner()) {
            $data['owner_type'] = get_class($owner);
            $data['owner_id'] = $owner->id;
        }

        // Store the uploaded file if present
        if (isset($data['image_url']) && is_object($data['image_url'])) {
            $file = $data['image_url'];
            $path = $file->store('hero-images', 'public');
            $data['image_url'] = Storage::url($path);
        }

        return HeroImage::create($data);
    }

    /**
     * A hero image may only be managed by its own owner.
     */
    private function authorizeOwner(HeroImage $image): void
    {
        $owner = $this->currentOwner();

        if (!$owner || $image->owner_type !== get_class($owner) || (int) $image->owner_id !== (int) $owner->id) {
            throw new AuthorizationException('You are not allowed to manage this hero image.');
        }
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

        $this->authorizeOwner($image);

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

        $this->authorizeOwner($image);

        // Delete the image file if it exists
        if ($image->image_url && strpos($image->image_url, 'storage/') !== false) {
            $oldPath = str_replace('/storage/', '', $image->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        // Delete the database record
        return $image->forceDelete() ? true : false;
    }
}
