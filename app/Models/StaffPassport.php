<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffPassport extends Model
{
    protected $table = 'staff_passports';

    protected $fillable = [
        'staffable_type', 'staffable_id', 'owner_type', 'owner_id',
        'passport_number', 'place_of_issue', 'date_of_issue',
        'expiry_date', 'front_image', 'back_image', 'is_foreigner',
        'visa_type', 'visa_number', 'visa_expiry_date',
    ];

    protected $casts = [
        'is_foreigner' => 'boolean',
        'date_of_issue' => 'date',
        'expiry_date' => 'date',
        'visa_expiry_date' => 'date',
    ];

    public function staffable()
    {
        return $this->morphTo();
    }

    public function owner()
    {
        return $this->morphTo();
    }
}
