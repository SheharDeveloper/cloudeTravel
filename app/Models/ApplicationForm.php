<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** The "Fill Application" form of one visa application. */
class ApplicationForm extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_SUBMITTED = 'submitted';

    protected $fillable = [
        'uid', 'booking_application_id', 'visa_id', 'status', 'submitted_at', 'updated_by_type', 'updated_by_id',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function application()
    {
        return $this->belongsTo(BookingApplication::class, 'booking_application_id');
    }

    public function visa()
    {
        return $this->belongsTo(Visa::class);
    }

    public function answers()
    {
        return $this->hasMany(ApplicationFormAnswer::class)->orderBy('sort_order');
    }

    protected static function booted(): void
    {
        static::creating(function (ApplicationForm $form) {
            $form->uid = $form->uid ?: (string) Str::uuid();
        });
    }
}
