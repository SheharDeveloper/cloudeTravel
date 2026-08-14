<?php

namespace App\Services;

class AddressService
{
    protected $addresses;

    public function __construct()
    {
        $this->addresses = config('addresses');
    }

    /**
     * Get all zip codes
     */
    public function getZipCodes(): array
    {
        return collect($this->addresses['zip_codes'])->map(function ($zip) {
            return [
                'id' => $zip['id'],
                'code' => $zip['code'],
                'city' => $zip['city'],
                'county' => $zip['county'],
                'country' => $zip['country'],
            ];
        })->toArray();
    }

    /**
     * Get formatted zip codes for dropdown
     */
    public function getZipCodesForDropdown(): array
    {
        return collect($this->addresses['zip_codes'])->mapWithKeys(function ($zip) {
            return [$zip['id'] => "{$zip['code']} - {$zip['city']}, {$zip['country']}"];
        })->toArray();
    }

    /**
     * Get addresses by zip code
     */
    public function getAddressesByZipCode(string $zipCodeId): array
    {
        $zipCode = collect($this->addresses['zip_codes'])
            ->firstWhere('id', $zipCodeId);

        return $zipCode ? $zipCode['addresses'] : [];
    }

    /**
     * Get formatted addresses for dropdown by zip code
     */
    public function getAddressesDropdownByZipCode(string $zipCodeId): array
    {
        $addresses = $this->getAddressesByZipCode($zipCodeId);

        return collect($addresses)->mapWithKeys(function ($address) {
            return [$address['id'] => $address['name']];
        })->toArray();
    }

    /**
     * Get streets by address
     */
    public function getStreetsByAddress(string $addressId): array
    {
        foreach ($this->addresses['zip_codes'] as $zipCode) {
            foreach ($zipCode['addresses'] as $address) {
                if ($address['id'] === $addressId) {
                    return $address['streets'];
                }
            }
        }
        return [];
    }

    /**
     * Get formatted streets for dropdown by address
     */
    public function getStreetsDropdownByAddress(string $addressId): array
    {
        $streets = $this->getStreetsByAddress($addressId);

        return collect($streets)->mapWithKeys(function ($street) {
            return [$street['id'] => $street['name']];
        })->toArray();
    }

    /**
     * Get location details (city, county, country) by zip code
     */
    public function getLocationByZipCode(string $zipCodeId): ?array
    {
        $zipCode = collect($this->addresses['zip_codes'])
            ->firstWhere('id', $zipCodeId);

        return $zipCode ? [
            'city' => $zipCode['city'],
            'county' => $zipCode['county'],
            'country' => $zipCode['country'],
        ] : null;
    }

    /**
     * Get full address details
     */
    public function getFullAddress(string $zipCodeId, string $addressId, string $streetId): array
    {
        $location = $this->getLocationByZipCode($zipCodeId);
        $addresses = $this->getAddressesByZipCode($zipCodeId);
        $address = collect($addresses)->firstWhere('id', $addressId);
        $street = collect($this->getStreetsByAddress($addressId))->firstWhere('id', $streetId);

        return [
            'zip_code' => $zipCodeId,
            'address' => $addressId,
            'street' => $streetId,
            'city' => $location['city'] ?? null,
            'county' => $location['county'] ?? null,
            'country' => $location['country'] ?? null,
            'address_name' => $address['name'] ?? null,
            'street_name' => $street['name'] ?? null,
        ];
    }

    /**
     * Get all address hierarchy data for frontend
     */
    public function getAllAddressData(): array
    {
        return $this->addresses['zip_codes'];
    }
}
