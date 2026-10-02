<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** A booking's signing request: the client signs its invoice through a secret link. */
class BookingSignature extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_SIGNED = 'signed';

    /** How long a link stays open from when it's (re)sent. */
    public const VALID_DAYS = 3;

    protected $fillable = [
        'uid', 'service_booking_id', 'signing_token', 'signer_name', 'signer_email', 'status',
        'expires_at', 'email_sent_at', 'email_count',
        'signature_data', 'terms_accepted_at', 'signed_at', 'signed_ip', 'signed_user_agent',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'email_sent_at' => 'datetime',
        'terms_accepted_at' => 'datetime',
        'signed_at' => 'datetime',
        'email_count' => 'integer',
    ];

    // The signature image and audit details never go out with the model by default
    protected $hidden = ['signature_data', 'signed_ip', 'signed_user_agent', 'signing_token'];

    public function booking()
    {
        return $this->belongsTo(ServiceBooking::class, 'service_booking_id');
    }

    public function isSigned(): bool
    {
        return $this->status === self::STATUS_SIGNED;
    }

    public function isExpired(): bool
    {
        return ! $this->isSigned() && $this->expires_at !== null && $this->expires_at->isPast();
    }

    protected static function booted(): void
    {
        static::creating(function (BookingSignature $signature) {
            $signature->uid = $signature->uid ?: (string) Str::uuid();
            $signature->signing_token = $signature->signing_token ?: Str::random(64);
        });
    }
}
