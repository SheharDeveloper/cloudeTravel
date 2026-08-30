<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskActivityLog extends Model
{
    protected $fillable = ['task_id', 'causer_type', 'causer_id', 'action', 'description'];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function causer()
    {
        return $this->morphTo();
    }
}
