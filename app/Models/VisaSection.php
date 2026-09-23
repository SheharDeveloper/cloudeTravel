<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisaSection extends Model
{
    protected $fillable = ['section_name', 'slug', 'status'];

    protected $casts = ['status' => 'boolean'];

    public function fields()
    {
        return $this->hasMany(VisaField::class);
    }

    public function sectionAssignments()
    {
        return $this->hasMany(VisaSectionAssignment::class);
    }
}
