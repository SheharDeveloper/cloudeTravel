<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
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
        // B2B registration (Form A)
        'registration_country',
        'contact_name',
        'contact_position',
        'branches_count',
        'preferred_currency',
        'expected_monthly_bookings',
        'payment_terms',
        'vat_registered',
        'vat_number',
        'authorised_rep_name',
        'authorised_rep_position',
        'terms_accepted_at',
    ];

    /** Expected monthly booking volume (B2B registration) */
    public const MONTHLY_BOOKINGS = [
        '1-10' => '1 – 10 bookings',
        '11-50' => '11 – 50 bookings',
        '51-100' => '51 – 100 bookings',
        '101-250' => '101 – 250 bookings',
        '250+' => 'More than 250 bookings',
    ];

    /** Requested payment terms (B2B registration) */
    public const PAYMENT_TERMS = [
        'prepaid' => 'Prepaid (pay before booking)',
        'weekly' => 'Weekly settlement',
        'fortnightly' => 'Fortnightly settlement',
        'monthly' => 'Monthly settlement',
        'credit_15' => '15-day credit',
        'credit_30' => '30-day credit',
    ];

    /** Business verification document types */
    public const DOCUMENT_TYPES = [
        'incorporation' => 'Certificate of Incorporation / Business Registration',
        'proof_of_address' => 'Proof of Business Address',
        'vat' => 'VAT Registration Certificate',
        'trade_license' => 'Trade / Travel Licence (e.g. ATOL, IATA)',
        'director_id' => 'ID of Director / Authorised Representative',
        'bank' => 'Bank Letter / Statement',
        'gst' => 'GST',
        'pan' => 'PAN',
        'license' => 'License',
        'agreement' => 'Agreement',
        'other' => 'Other',
    ];

    protected $casts = [
        'tax_status' => 'integer',
        'has_domain' => 'boolean',
        'status' => 'boolean',
        'services' => 'array',
        'vat_registered' => 'boolean',
        'branches_count' => 'integer',
        'terms_accepted_at' => 'datetime',
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

    public function commissions(): HasMany
    {
        return $this->hasMany(AgencyCommission::class);
    }

    public function contactInfo(): MorphOne
    {
        return $this->morphOne(ContactInfo::class, 'owner');
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
