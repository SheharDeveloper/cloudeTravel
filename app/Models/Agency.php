<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agency extends Model
{
    use HasFactory;
    protected $fillable = [
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
        'tax_status',
    ];

    protected $casts = [
        'tax_status' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function agencyDocuments(): HasMany
    {
        return $this->hasMany(AgencyDocument::class);
    }
}
