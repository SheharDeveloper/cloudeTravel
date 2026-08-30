<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Task extends Model
{
    protected $fillable = [
        'uid', 'owner_type', 'owner_id', 'title', 'details', 'priority', 'due_date', 'status', 'status_updated_at', 'remark',
        'assigned_to_type', 'assigned_to_id', 'created_by_type', 'created_by_id',
    ];

    protected $casts = [
        'due_date' => 'date',
        'status_updated_at' => 'datetime',
    ];

    /**
     * The agency this task belongs to, or null for a superadmin-side task.
     */
    public function owner()
    {
        return $this->morphTo();
    }

    /**
     * The staff member this task is assigned to: App\Models\User or
     * App\Models\AgencyUser.
     */
    public function assignedTo()
    {
        return $this->morphTo();
    }

    /**
     * Whoever created the task: App\Models\User or App\Models\AgencyUser.
     */
    public function createdBy()
    {
        return $this->morphTo();
    }

    public function attachments()
    {
        return $this->hasMany(TaskAttachment::class);
    }

    public function notes()
    {
        return $this->hasMany(TaskNote::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(TaskActivityLog::class);
    }

    protected static function booted(): void
    {
        static::creating(function (Task $task) {
            if (empty($task->uid)) {
                $task->uid = Str::uuid();
            }

            if (empty($task->status_updated_at)) {
                $task->status_updated_at = now();
            }
        });
    }
}
