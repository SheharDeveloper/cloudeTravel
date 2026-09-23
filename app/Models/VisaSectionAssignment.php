<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisaSectionAssignment extends Model
{
    protected $fillable = ['visa_id', 'visa_section_id', 'is_enabled', 'sort_order'];

    protected $casts = ['is_enabled' => 'boolean', 'sort_order' => 'integer'];

    public function visa()
    {
        return $this->belongsTo(Visa::class);
    }

    public function section()
    {
        return $this->belongsTo(VisaSection::class, 'visa_section_id');
    }
}
