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
        'sent_to_admin_at', 'sent_by_type', 'sent_by_id', 'updated_after_send_at',
    ];

    protected $casts = [
        'amount' => 'float',
        'sent_to_admin_at' => 'datetime',
        'updated_after_send_at' => 'datetime',
    ];

    /** Changes made to the submitted form (Visa Updation Log Data), newest first. */
    public function formLogs()
    {
        return $this->hasMany(ApplicationFormLog::class)->latest('id');
    }

    /** Documents requested for this application, with their uploaded files (Upload Document). */
    public function documents()
    {
        return $this->hasMany(ApplicationDocument::class)->orderBy('sort_order')->orderBy('id');
    }

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
