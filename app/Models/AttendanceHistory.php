<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceHistory extends Model
{
    protected $fillable = [
        'staffable_type', 'staffable_id', 'owner_type', 'owner_id',
        'date', 'event', 'batch_id', 'leave_type_id', 'status', 'work_type', 'occurred_at', 'notes',
        'causer_type', 'causer_id',
    ];

    protected $casts = [
        'date' => 'date',
        'occurred_at' => 'datetime',
    ];

    public function staffable()
    {
        return $this->morphTo();
    }

    public function owner()
    {
        return $this->morphTo();
    }

    public function causer()
    {
        return $this->morphTo();
    }

    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class);
    }
}
