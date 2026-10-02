<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgencyCommission extends Model
{
    public const TYPE_PERCENTAGE = 'percentage';
    public const TYPE_FIXED = 'fixed';

    protected $fillable = ['agency_id', 'service_name', 'commission_type', 'commission_value'];

    protected $casts = [
        'commission_value' => 'float',
    ];

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }
}
