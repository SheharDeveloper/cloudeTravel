<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisaFieldAssignment extends Model
{
    // visa_section_id: the section the field is shown in for this visa, when moved from its own
    protected $fillable = ['visa_id', 'visa_field_id', 'visa_section_id', 'is_enabled', 'is_required', 'sort_order'];

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
