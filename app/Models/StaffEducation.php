<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffEducation extends Model
{
    protected $table = 'staff_educations';

    protected $fillable = ['staffable_type', 'staffable_id', 'owner_type', 'owner_id', 'name', 'photo'];

    public function staffable()
    {
        return $this->morphTo();
    }

    public function owner()
    {
        return $this->morphTo();
    }
}
