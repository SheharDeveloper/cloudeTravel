<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientPassport extends Model
{
    protected $table = 'client_passports';

    protected $fillable = [
        'client_id', 'passport_number', 'place_of_issue', 'date_of_issue', 'expiry_date',
        'front_image', 'back_image', 'is_foreigner', 'visa_type', 'visa_number', 'visa_expiry_date',
    ];

    protected $casts = [
        'date_of_issue' => 'date',
        'expiry_date' => 'date',
        'visa_expiry_date' => 'date',
        'is_foreigner' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
