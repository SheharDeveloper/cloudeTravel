<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientFolder extends Model
{
    protected $table = 'client_folders';

    protected $fillable = [
        'client_id', 'parent_id', 'owner_type', 'owner_id', 'name',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function parent()
    {
        return $this->belongsTo(ClientFolder::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(ClientFolder::class, 'parent_id');
    }

    public function documents()
    {
        return $this->hasMany(ClientDocument::class, 'folder_id');
    }

    /**
     * Who created this folder: App\Models\Agency or App\Models\User
     */
    public function owner()
    {
        return $this->morphTo();
    }
}
