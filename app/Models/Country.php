<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'countries';

    protected $fillable = [
        'countryCode',
        'countryName',
    ];

    protected $appends = ['flag_url'];

    public function getFlagUrlAttribute()
    {
        return asset('assets/flags/64x48/' . strtolower($this->countryCode) . '.png');
    }
}
