<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaxSetup extends Model
{
    protected $fillable = [
        'country_id',
        'tax_name',
        'amount',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }
}
