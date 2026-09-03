<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\AgencyUser;
use App\Models\SpecialOffer;
use App\Models\SpecialOfferImage;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class SpecialOfferService
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
     * Public, active offers for the viewing agency's domain, falling back
     * to the global/default set if it has none of its own.
     */
    public function getAll(int $perPage = 15, int $page = 1, ?string $type = null, bool $featuredOnly = false, ?string $search = null): LengthAwarePaginator
    {
        $query = SpecialOffer::with('images')->where('is_active', true);
        $this->scopeToViewer($query);

        if ($type) {
            $query->where('type', $type);
        }

        if ($featuredOnly) {
            $query->where('is_featured', true);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * All offers belonging to the current admin session (this agency's own,
     * or the superadmin's own global/default set).
     */
    public function getAllForAdmin(int $perPage = 15, int $page = 1): LengthAwarePaginator
    {
        $query = SpecialOffer::with('images');

        if ($owner = $this->currentOwner()) {
            $query->where('owner_type', get_class($owner))->where('owner_id', $owner->id);
        }

        return $query->latest()->paginate($perPage, ['*'], 'page', $page);
    }

    private function scopeToViewer($query): void
    {
        if (($agency = $this->viewingAgency()) && SpecialOffer::where('owner_type', Agency::class)->where('owner_id', $agency->id)->exists()) {
            $query->where('owner_type', Agency::class)->where('owner_id', $agency->id);
        } else {
            $query->where('owner_type', User::class);
        }
    }

    public function getById(int $id): ?SpecialOffer
    {
        return SpecialOffer::with('images')->find($id);
    }

    public function getByUid(string $uid): ?SpecialOffer
    {
        return SpecialOffer::with('images')->where('uid', $uid)->first();
    }

    public function create(array $data): SpecialOffer
    {
        if ($owner = $this->currentOwner()) {
            $data['owner_type'] = get_class($owner);
            $data['owner_id'] = $owner->id;
        }

        return SpecialOffer::create($data);
    }

    /**
     * A special offer may only be managed by its own owner.
     */
    private function authorizeOwner(SpecialOffer $offer): void
    {
        $owner = $this->currentOwner();

        if (!$owner || $offer->owner_type !== get_class($owner) || (int) $offer->owner_id !== (int) $owner->id) {
            throw new AuthorizationException('You are not allowed to manage this special offer.');
        }
    }

    public function update(SpecialOffer $offer, array $data): SpecialOffer
    {
        $this->authorizeOwner($offer);
        $offer->update($data);
        return $offer;
    }

    public function delete(SpecialOffer $offer): bool
    {
        $this->authorizeOwner($offer);
        return $offer->delete();
    }

    public function addFlight(SpecialOffer $offer, array $data)
    {
        return $offer->flights()->create($data);
    }

    public function addHotel(SpecialOffer $offer, array $data)
    {
        return $offer->hotels()->create($data);
    }

    public function addVisa(SpecialOffer $offer, array $data)
    {
        return $offer->visas()->create($data);
    }

    public function addTransport(SpecialOffer $offer, array $data)
    {
        return $offer->transports()->create($data);
    }

    public function addImage(SpecialOffer $offer, array $data)
    {
        return $offer->images()->create($data);
    }

    public function removeImage(int $imageId): bool
    {
        $image = SpecialOfferImage::with('specialOffer')->find($imageId);
        if (!$image) {
            return false;
        }

        $this->authorizeOwner($image->specialOffer);

        return $image->delete();
    }

    public function updateImage(int $imageId, array $data): ?SpecialOfferImage
    {
        $image = SpecialOfferImage::with('specialOffer')->find($imageId);
        if (!$image) {
            return null;
        }

        $this->authorizeOwner($image->specialOffer);

        $image->update($data);
        return $image;
    }
}
