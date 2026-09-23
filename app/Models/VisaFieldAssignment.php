<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisaFieldAssignment extends Model
{
    protected $fillable = ['visa_id', 'visa_field_id', 'is_enabled', 'is_required', 'sort_order'];

    protected $casts = ['is_enabled' => 'boolean', 'is_required' => 'boolean', 'sort_order' => 'integer'];

    public function visa()
    {
        return $this->belongsTo(Visa::class);
    }

    public function field()
    {
        return $this->belongsTo(VisaField::class, 'visa_field_id');
    }
}
