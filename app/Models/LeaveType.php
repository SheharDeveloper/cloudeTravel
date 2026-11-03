<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    // is_paid: an approved day of this leave is paid as a full working day (salary slip)
    protected $fillable = ['owner_type', 'owner_id', 'name', 'days', 'is_paid'];

    protected $casts = ['is_paid' => 'boolean'];

    public function owner()
    {
        return $this->morphTo();
    }
}
