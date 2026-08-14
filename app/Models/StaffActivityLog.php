<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffActivityLog extends Model
{
    protected $table = 'staff_activity_logs';

    protected $fillable = [
        'staffable_type', 'staffable_id', 'causer_type', 'causer_id', 'action', 'description',
    ];

    public function staffable()
    {
        return $this->morphTo();
    }

    public function causer()
    {
        return $this->morphTo();
    }
}
