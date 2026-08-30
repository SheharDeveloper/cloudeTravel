<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientDocument extends Model
{
    protected $table = 'client_documents';

    protected $fillable = [
        'documentable_type', 'documentable_id', 'owner_type', 'owner_id', 'folder_id',
        'document_name', 'document_type', 'file_path', 'file_type',
    ];

    /**
     * The record this document belongs to: currently always App\Models\Client
     */
    public function documentable()
    {
        return $this->morphTo();
    }

    /**
     * The agency or superadmin this document belongs to
     */
    public function owner()
    {
        return $this->morphTo();
    }

    /**
     * The folder this document sits in, or null for the client's root
     */
    public function folder()
    {
        return $this->belongsTo(ClientFolder::class, 'folder_id');
    }
}
