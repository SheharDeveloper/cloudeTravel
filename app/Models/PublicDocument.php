<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicDocument extends Model
{
    protected $table = 'public_documents';

    protected $fillable = [
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
}
