<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskNote extends Model
{
    protected $fillable = ['task_id', 'author_type', 'author_id', 'note'];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function author()
    {
        return $this->morphTo();
    }
}
