<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Agency extends Model
{
    use HasFactory, \Spatie\Permission\Traits\HasRoles;

    /**
     * Permissions are granted to an agency by the superadmin, so they live
     * on the same guard as the seeded permission set.
     */
    protected $guard_name = 'web';
    protected $fillable = [
        'uid',
        'user_id',
        'agency_name',
        'legal_name',
        'email',
        'phone_number',
        'alternate_phone',
        'website',
        'country',
        'state',
        'city',
        'postal_code',
        'address',
        'registration_number',
        'gst_number',
        'pan_number',
        'account_number',
        'ifsc_code',
        'note',
        'services',
        'logo',
        'has_domain',
        'tenant_id',
        'zip_code_id',
        'address_id',
        'street_id',
        'tax_status',
        'status',
    ];

    protected $casts = [
        'tax_status' => 'integer',
        'has_domain' => 'boolean',
        'status' => 'boolean',
        'services' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function agencyDocuments(): HasMany
    {
        return $this->hasMany(AgencyDocument::class);
    }

    public function agencyServices(): HasMany
    {
        return $this->hasMany(AgencyService::class);
    }

    protected static function booted(): void
    {
        static::creating(function ($agency) {
            if (empty($agency->uid)) {
                $agency->uid = Str::uuid();
            }
        });
    }
}
