<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    use HasFactory;
    protected $fillable = [
        'agency_document_id',
        'document_name',
        'path',
        'size',
    ];

    public function agencyDocument(): BelongsTo
    {
        return $this->belongsTo(AgencyDocument::class, 'agency_document_id');
    }
}
