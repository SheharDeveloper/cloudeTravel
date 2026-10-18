<?php

namespace App\Mail;

use App\Models\ReceivedDocument;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/** "Send Notification" on Client Documents: the document's status, to the client. */
class ReceivedDocumentNotice extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ReceivedDocument $document,
        public array $brand,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->document->isReturned()
                ? "Your document has been returned: {$this->document->document_name}"
                : "We have your document: {$this->document->document_name}",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.received-document');
    }
}
