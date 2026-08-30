<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'staffable_type', 'staffable_id', 'owner_type', 'owner_id',
        'date', 'checked_in_at', 'checked_out_at',
    ];

    protected $casts = [
        'date' => 'date',
        'checked_in_at' => 'datetime',
        'checked_out_at' => 'datetime',
    ];

    public function staffable()
    {
        return $this->morphTo();
    }

    public function owner()
    {
        return $this->morphTo();
    }
}
