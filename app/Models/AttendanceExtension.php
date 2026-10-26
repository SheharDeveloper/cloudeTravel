<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Extra minutes past a staff member's shift end time on a day, given by an admin. */
class AttendanceExtension extends Model
{
    protected $fillable = [
        'staffable_type', 'staffable_id', 'owner_type', 'owner_id', 'date', 'minutes', 'granted_by',
    ];

    protected $casts = [
        'date' => 'date',
        'minutes' => 'integer',
    ];

    public function staffable()
    {
        return $this->morphTo();
    }
}
