<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisaField extends Model
{
    protected $fillable = ['visa_section_id', 'field_name', 'slug', 'field_type', 'status'];

    protected $casts = ['status' => 'boolean'];

    public function section()
    {
        return $this->belongsTo(VisaSection::class, 'visa_section_id');
    }

    public function fieldAssignments()
    {
        return $this->hasMany(VisaFieldAssignment::class);
    }
}
