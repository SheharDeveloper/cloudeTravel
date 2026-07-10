<?php

namespace App\Services;

use App\Models\SpecialOffer;
use App\Models\SpecialOfferImage;
use Illuminate\Pagination\LengthAwarePaginator;

class SpecialOfferService
{
    public function getAll(int $perPage = 15, int $page = 1): LengthAwarePaginator
    {
        return SpecialOffer::with('images')
            ->where('is_active', true)
            ->latest()
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getAllForAdmin(int $perPage = 15, int $page = 1): LengthAwarePaginator
    {
        return SpecialOffer::with('images')
            ->latest()
            ->paginate($perPage, ['*'], 'page', $page);
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
        return SpecialOffer::create($data);
    }

    public function update(SpecialOffer $offer, array $data): SpecialOffer
    {
        $offer->update($data);
        return $offer;
    }

    public function delete(SpecialOffer $offer): bool
    {
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
        $image = SpecialOfferImage::find($imageId);
        return $image ? $image->delete() : false;
    }

    public function updateImage(int $imageId, array $data): ?SpecialOfferImage
    {
        $image = SpecialOfferImage::find($imageId);
        if ($image) {
            $image->update($data);
        }
        return $image;
    }
}
