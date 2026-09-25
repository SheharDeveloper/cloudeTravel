<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Multitenancy\Models\Concerns\UsesLandlordConnection;

class Domain extends Model
{
    use UsesLandlordConnection;

    /**
     * First path segments a "path" domain slug must never equal — every
     * top-level route the app already serves, so a slug can never collide
     * with a real route. Checked by RewriteTenantPathPrefix.
     */
    public const RESERVED_PATH_SLUGS = [
        'about-us', 'admin', 'agency', 'all-offers', 'api', 'assets', 'attendance',
        'build', 'confirm-password', 'contact-us', 'dashboard', 'email', 'favicon.ico',
        'flights', 'forgot-password', 'horizon', 'hotels', 'login', 'logout',
        'offers', 'other-services', 'packages', 'password', 'profile', 'profile-upload',
        'quote', 'register', 'reset-password', 'robots.txt', 'sanctum', 'search',
        'settings', 'sitemap.xml', 'static', 'storage', 'telescope', 'tenancy',
        'tickets', 'tours', 'two-factor-challenge', 'up', 'user', 'verify-email',
        'visa', 'visa-requirements', 'visa-services', 'visas', '__clockwork',
    ];

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

    public function isPath(): bool
    {
        return $this->type === 'path';
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
