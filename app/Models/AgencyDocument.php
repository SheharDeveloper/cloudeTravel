<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AgencyDocument extends Model
{
    use HasFactory;
    protected $table = 'agency_documents';

    protected $fillable = [
        'agency_id',
        'document_name',
        'document_type',
        'document_master_id',
        'upload_status',
    ];

    protected $casts = [
        'upload_status' => 'integer',
    ];

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'agency_document_id');
    }
}
