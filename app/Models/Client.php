<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Client extends Model
{
    protected $table = 'clients';

    protected $fillable = [
        'uid', 'owner_type', 'owner_id', 'name', 'email', 'phone', 'nationality', 'gender', 'dob', 'status', 'notes',
    ];

    protected $casts = [
        'dob' => 'date',
    ];

    /**
     * The agency or superadmin this client belongs to
     */
    public function owner()
    {
        return $this->morphTo();
    }

    public function address()
    {
        return $this->hasOne(ClientAddress::class);
    }

    public function passport()
    {
        return $this->hasOne(ClientPassport::class);
    }

    public function familyMembers()
    {
        return $this->hasMany(ClientFamilyMember::class);
    }

    public function documents()
    {
        return $this->morphMany(ClientDocument::class, 'documentable');
    }

    /**
     * Every folder belonging to this client, flat (not just top-level) —
     * the document browser filters this by parent_id on the frontend.
     */
    public function folders()
    {
        return $this->hasMany(ClientFolder::class)->orderBy('name');
    }

    public function communications()
    {
        return $this->morphMany(Communication::class, 'communicable')->latest();
    }

    /**
     * The name of this client's dedicated storage folder: a readable slug
     * of their name plus a short slice of their uid to keep it unique.
     */
    public function folderName(): string
    {
        return Str::slug($this->name) . '-' . substr($this->uid, 0, 8);
    }

    protected static function booted(): void
    {
        static::creating(function ($client) {
            if (empty($client->uid)) {
                $client->uid = Str::uuid();
            }
        });
    }
}
