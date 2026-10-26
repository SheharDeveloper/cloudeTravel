<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** A staff member's salary for a period (superadmin or agency staff, through the staffable morph). */
class SalarySlip extends Model
{
    protected $fillable = [
        'uid', 'staffable_type', 'staffable_id', 'owner_type', 'owner_id', 'month', 'period_start', 'period_end', 'staff_name',
        'salary', 'salary_type', 'currency', 'shift', 'days_present', 'days_leave', 'days_absent',
        'worked_minutes', 'hourly_rate', 'gross', 'deductions', 'total_deductions', 'net',
        'generated_by', 'generated_at',
    ];

    protected $casts = [
        'deductions' => 'array',
        'salary' => 'float',
        'hourly_rate' => 'float',
        'gross' => 'float',
        'total_deductions' => 'float',
        'net' => 'float',
        'generated_at' => 'datetime',
        'period_start' => 'datetime',
        'period_end' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (SalarySlip $slip) {
            $slip->uid ??= (string) Str::uuid();
        });
    }

    public function staffable()
    {
        return $this->morphTo();
    }
}
