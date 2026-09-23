<?php

namespace App\Services;

use App\Models\VisaServiceCategory;

class VisaServiceCategoryService
{
    public function all()
    {
        return VisaServiceCategory::orderBy('name')->get();
    }
}
