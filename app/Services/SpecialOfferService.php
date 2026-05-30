<?php

namespace App\Services;

use App\Models\SpecialOffer;

class SpecialOfferService
{
    /**
     * Get all special offers
     * Note: SpecialOffer doesn't have a status field, so all offers are shown regardless of status parameter
     */
    public function getAll(bool $showAll = false, $status = null): array
    {
        return SpecialOffer::all()->toArray();
    }

    /**
     * Get a single special offer by ID
     */
    public function getById(int $id): ?SpecialOffer
    {
        return SpecialOffer::find($id);
    }

    /**
     * Create a new special offer
     */
    public function create(array $data): SpecialOffer
    {
        return SpecialOffer::create($data);
    }

    /**
     * Update a special offer
     */
    public function update(int $id, array $data): ?SpecialOffer
    {
        $offer = SpecialOffer::find($id);
        if (!$offer) {
            return null;
        }

        $offer->update($data);
        return $offer;
    }

    /**
     * Delete a special offer
     */
    public function delete(int $id): bool
    {
        $offer = SpecialOffer::find($id);
        if (!$offer) {
            return false;
        }

        return $offer->forceDelete() ? true : false;
    }
}
