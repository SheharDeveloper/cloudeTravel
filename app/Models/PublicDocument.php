<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicDocument extends Model
{
    protected $table = 'public_documents';

    protected $fillable = [
        'owner_type',
        'owner_id',
        'title',
        'document_path',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = ['display_url'];

    public function getDisplayUrlAttribute(): string
    {
        $path = ltrim($this->document_path, '/');
        return route('documents.show', ['filename' => basename($path)]);
    }

    /**
     * Who this document belongs to: App\Models\Agency or App\Models\User
     */
    public function owner()
    {
        return $this->morphTo();
    }
}
