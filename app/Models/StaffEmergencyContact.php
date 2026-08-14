<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffEmergencyContact extends Model
{
    protected $table = 'staff_emergency_contacts';

    protected $fillable = [
        'staffable_type', 'staffable_id', 'owner_type', 'owner_id',
        'contact_name', 'relationship', 'phone', 'alternate_phone', 'address',
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
