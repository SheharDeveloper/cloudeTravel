<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientFamilyMember extends Model
{
    protected $table = 'client_family_members';

    protected $fillable = [
        'client_id', 'name', 'relation', 'dob', 'passport_number', 'id_number',
    ];

    protected $casts = [
        'dob' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
