<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** One passenger's application within a service booking. */
class BookingApplication extends Model
{
    protected $fillable = [
        'uid', 'service_booking_id', 'client_family_member_id', 'relation',
        'first_name', 'last_name', 'email', 'passport_number', 'nationality', 'phone', 'amount', 'status',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    /** The "Fill Application" form for this application, once started. */
    public function form()
    {
        return $this->hasOne(ApplicationForm::class);
    }

    protected $appends = ['application_number'];

    /** CLDACI + the id, padded: CLDACI00102. Fixed for the life of the application. */
    public function getApplicationNumberAttribute(): ?string
    {
        return $this->id ? 'CLDACI' . str_pad((string) $this->id, 5, '0', STR_PAD_LEFT) : null;
    }

    public function booking()
    {
        return $this->belongsTo(ServiceBooking::class, 'service_booking_id');
    }

    protected static function booted(): void
    {
        static::creating(function (BookingApplication $application) {
            if (empty($application->uid)) {
                $application->uid = (string) Str::uuid();
            }
        });
    }
}
