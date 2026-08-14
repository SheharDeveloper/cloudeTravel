<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Multitenancy\Models\Concerns\UsesLandlordConnection;

class Domain extends Model
{
    use UsesLandlordConnection;

    protected $fillable = [
        'uuid',
        'tenant_id',
        'domain',
        'type',
        'is_primary',
        'verified_at',
        'ssl_status',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'is_primary' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function ($domain) {
            if (empty($domain->uuid)) {
                $domain->uuid = \Illuminate\Support\Str::uuid();
            }
        });
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function isPrimary(): bool
    {
        return $this->is_primary;
    }

    public function isVerified(): bool
    {
        return $this->verified_at !== null;
    }

    public function isCustomDomain(): bool
    {
        return $this->type === 'custom';
    }

    public function isSubdomain(): bool
    {
        return $this->type === 'subdomain';
    }

    public function markAsVerified(): void
    {
        $this->update(['verified_at' => now()]);
    }

    public function markAsSSLActive(): void
    {
        $this->update(['ssl_status' => 'active']);
    }

    public function markAsSSLFailed(): void
    {
        $this->update(['ssl_status' => 'failed']);
    }
}
