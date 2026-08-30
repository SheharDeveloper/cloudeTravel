<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientAddress extends Model
{
    protected $table = 'client_addresses';

    protected $fillable = [
        'client_id', 'address', 'city', 'state', 'country', 'zip_code',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
