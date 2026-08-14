<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgencyService extends Model
{
    protected $fillable = ['agency_id', 'service_name', 'status'];

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }
}
