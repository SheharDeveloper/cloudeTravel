<?php

namespace App\Mail;

use App\Models\BookingApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/** The OTP to open a shared application ("Share Application"). */
class ApplicationShareOtp extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public BookingApplication $application,
        public string $otp,
        public int $minutes,
        public array $brand,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Your OTP for application {$this->application->application_number}",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.application-share-otp');
    }
}
