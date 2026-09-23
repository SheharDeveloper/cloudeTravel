<?php

namespace App\Services;

use App\Models\VisaType;

class VisaTypeService
{
    public function all()
    {
        return VisaType::orderBy('name')->get();
    }

    public function create(array $data): VisaType
    {
        return VisaType::create($data);
    }

    public function update(VisaType $visaType, array $data): VisaType
    {
        $visaType->update($data);

        return $visaType->fresh();
    }

    public function delete(VisaType $visaType): bool
    {
        return (bool) $visaType->delete();
    }
}
