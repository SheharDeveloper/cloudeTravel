<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** A booking for any service (visa, flight, hotel…) made from the admin side. */
class ServiceBooking extends Model
{
    protected $fillable = [
        'uid', 'invoice_number', 'service', 'owner_type', 'owner_id', 'client_id', 'service_date', 'passengers',
        'currency_code', 'currency_symbol', 'base_amount', 'service_fee', 'tax_amount', 'total_amount', 'details', 'invoice_remark', 'status',
    ];

    /** Set when the client signs the invoice ("Doc Sign"); bookings start as 'pending'. */
    public const STATUS_SIGNED = 'signed';

    /** Longest invoice remark, counted as the text a reader sees (not the HTML). */
    public const REMARK_MAX_CHARS = 500;

    protected $casts = [
        'service_date' => 'date:Y-m-d',
        'passengers' => 'integer',
        'base_amount' => 'float',
        'service_fee' => 'float',
        'tax_amount' => 'float',
        'total_amount' => 'float',
        'details' => 'array',
    ];

    public function owner()
    {
        return $this->morphTo();
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function applications()
    {
        return $this->hasMany(BookingApplication::class)->orderBy('id');
    }

    /** The "Doc Sign" request for this booking's invoice, once generated. */
    public function signature()
    {
        return $this->hasOne(BookingSignature::class);
    }

    protected static function booted(): void
    {
        static::creating(function (ServiceBooking $booking) {
            if (empty($booking->uid)) {
                $booking->uid = (string) Str::uuid();
            }
        });

        // INV + the id, padded: INV000012.
        static::created(function (ServiceBooking $booking) {
            if (empty($booking->invoice_number)) {
                $booking->invoice_number = 'INV' . str_pad((string) $booking->id, 6, '0', STR_PAD_LEFT);
                $booking->saveQuietly();
            }
        });
    }
}
