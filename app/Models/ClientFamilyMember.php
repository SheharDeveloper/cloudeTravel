<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientFamilyMember extends Model
{
    protected $table = 'client_family_members';

    protected $fillable = [
        'client_id', 'name', 'relation', 'dob', 'passport_number',
        'place_of_issue', 'date_of_issue', 'expiry_date', 'front_image', 'back_image', 'id_number',
    ];

    protected $casts = [
        'dob' => 'date',
        'date_of_issue' => 'date',
        'expiry_date' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
