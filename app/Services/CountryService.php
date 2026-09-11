<?php

namespace App\Services;

use App\Models\Country;

class CountryService
{
    /**
     * Countries are a global reference table — not scoped to any
     * agency/owner, so this searches the whole table.
     */
    public function search(string $search = '', int $perPage = 15)
    {
        $query = Country::query();

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('countryName', 'like', "%{$search}%")
                  ->orWhere('countryCode', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('countryName')->paginate($perPage);
    }

    public function create(array $data): Country
    {
        return Country::create($data);
    }

    public function update(Country $country, array $data): Country
    {
        $country->update($data);

        return $country->fresh();
    }

    public function delete(Country $country): bool
    {
        return (bool) $country->delete();
    }
}
