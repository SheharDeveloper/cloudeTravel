<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    protected $fillable = ['owner_type', 'owner_id', 'name', 'days'];

    public function owner()
    {
        return $this->morphTo();
    }
}
