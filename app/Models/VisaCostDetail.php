<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisaCostDetail extends Model
{
    protected $fillable = [
        'visa_id',
        'type',
        'validation_process',
        'processing_time',
        'embassy_fee',
        'service_fee',
        'tax_fee',
        'credit_amount',
        'tax_amount',
        'total_cost',
    ];

    protected $casts = [
        'embassy_fee' => 'decimal:2',
        'service_fee' => 'decimal:2',
        'tax_fee' => 'decimal:2',
        'credit_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    public function visa()
    {
        return $this->belongsTo(Visa::class);
    }
}
