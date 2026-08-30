<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffProfile extends Model
{
    protected $table = 'staff_profiles';

    protected $fillable = [
        'staffable_type', 'staffable_id', 'owner_type', 'owner_id', 'dob', 'joining_date', 'passport_number', 'country',
        'zip_code_id', 'address_id', 'street_id', 'county', 'city', 'address', 'skills',
    ];

    protected $casts = [
        'skills' => 'array',
        'dob' => 'date',
        'joining_date' => 'date',
    ];

    /**
     * The staff member this profile describes: App\Models\User (superadmin
     * staff) or App\Models\AgencyUser (agency staff)
     */
    public function staffable()
    {
        return $this->morphTo();
    }

    /**
     * The agency or superadmin this staff member belongs to
     */
    public function owner()
    {
        return $this->morphTo();
    }
}
