<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** A physical document received from a client (Client Documents), until it's returned. */
class ReceivedDocument extends Model
{
    protected $fillable = [
        'uid', 'client_id', 'owner_type', 'owner_id', 'document_name', 'received_at', 'remarks',
        'returned_at', 'return_remarks', 'notified_at', 'notification_count', 'created_by_type', 'created_by_id',
    ];

    protected $casts = [
        'received_at' => 'datetime',
        'returned_at' => 'datetime',
        'notified_at' => 'datetime',
        'notification_count' => 'integer',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function owner()
    {
        return $this->morphTo();
    }

    public function isReturned(): bool
    {
        return $this->returned_at !== null;
    }

    protected static function booted(): void
    {
        static::creating(function (ReceivedDocument $document) {
            if (empty($document->uid)) {
                $document->uid = (string) Str::uuid();
            }
        });
    }
}
