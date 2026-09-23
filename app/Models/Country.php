<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Country extends Model
{
    protected $table = 'countries';

    protected $fillable = [
        'uid',
        'countryCode',
        'countryName',
        'currency_code',
        'exchange_rate',
    ];

    protected $appends = ['flag_url'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uid)) {
                $model->uid = (string) Str::uuid();
            }
        });
    }

    public function getFlagUrlAttribute()
    {
        return asset('assets/flags/64x48/' . strtolower($this->countryCode) . '.png');
    }
}
