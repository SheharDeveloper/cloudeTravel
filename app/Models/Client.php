<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * A client of an agency (or of the superadmin). Clients can sign in on their
 * agency's domain (the "client" guard) once the agency sets a password.
 */
class Client extends Authenticatable
{
    protected $table = 'clients';

    protected $fillable = [
        'uid', 'cid', 'owner_type', 'owner_id', 'name', 'first_name', 'last_name', 'email', 'phone', 'nationality', 'gender', 'dob', 'status', 'notes',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'dob' => 'date',
        'password' => 'hashed',
        'last_login_at' => 'datetime',
    ];

    /** Whether the client can sign in: a password is set and the client is active. */
    public function canLogIn(): bool
    {
        return $this->password !== null && $this->status === 'active';
    }

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

    /** Whether the client still signs in with the default password: their email address. */
    public function hasDefaultPassword(): bool
    {
        return $this->password !== null && $this->email && Hash::check($this->email, $this->password);
    }

    protected static function booted(): void
    {
        static::creating(function ($client) {
            if (empty($client->uid)) {
                $client->uid = Str::uuid();
            }

            if (empty($client->cid)) {
                $client->cid = self::generateCid($client->owner_type);
            }

            // Client Login: the default password is the client's email (the agency can change it)
            if (empty($client->password) && $client->email) {
                $client->password = $client->email;
            }
        });

        // A changed email takes a still-default password along with it
        static::updating(function (Client $client) {
            if ($client->isDirty('email') && $client->email && ! $client->isDirty('password')) {
                $oldEmail = $client->getOriginal('email');
                $stillDefault = $client->getOriginal('password') && $oldEmail && Hash::check($oldEmail, $client->getOriginal('password'));
                if ($stillDefault) {
                    $client->password = $client->email;
                }
            }
        });
    }

    /**
     * CLDC0000001 for a superadmin-owned client, CLDCA00001 for an
     * agency-owned one. Each prefix runs its own count, shared across all
     * agencies rather than reset per agency. Locks the count row-scan so
     * two clients created in the same instant don't collide.
     */
    private static function generateCid(?string $ownerType): string
    {
        $isAgency = $ownerType === Agency::class;
        $count = self::where('owner_type', $ownerType)->lockForUpdate()->count();

        return $isAgency
            ? 'CLDCA' . str_pad((string) ($count + 1), 5, '0', STR_PAD_LEFT)
            : 'CLDC' . str_pad((string) ($count + 1), 7, '0', STR_PAD_LEFT);
    }
}
