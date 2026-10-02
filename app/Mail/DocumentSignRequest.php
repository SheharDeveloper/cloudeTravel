<?php

namespace App\Mail;

use App\Models\BookingSignature;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/** The link to sign a booking's invoice on the Document Signing Portal. */
class DocumentSignRequest extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public BookingSignature $signature,
        public string $url,
        public array $brand,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Please sign your booking {$this->signature->booking->invoice_number}",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.document-sign');
    }
}
