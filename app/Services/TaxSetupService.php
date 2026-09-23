<?php

namespace App\Services;

use App\Models\TaxSetup;

class TaxSetupService
{
    public function all()
    {
        return TaxSetup::with('country')->orderBy('id', 'desc')->get();
    }

    public function create(array $data): TaxSetup
    {
        return TaxSetup::create($data);
    }

    public function update(TaxSetup $taxSetup, array $data): TaxSetup
    {
        $taxSetup->update($data);

        return $taxSetup->fresh('country');
    }

    public function delete(TaxSetup $taxSetup): bool
    {
        return (bool) $taxSetup->delete();
    }
}
