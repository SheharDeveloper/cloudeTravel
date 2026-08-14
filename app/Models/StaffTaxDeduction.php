<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffTaxDeduction extends Model
{
    protected $table = 'staff_tax_deductions';

    protected $fillable = ['staffable_type', 'staffable_id', 'owner_type', 'owner_id', 'name', 'value', 'type'];

    public function staffable()
    {
        return $this->morphTo();
    }

    public function owner()
    {
        return $this->morphTo();
    }
}
