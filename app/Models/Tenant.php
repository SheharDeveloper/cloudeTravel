<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Multitenancy\Models\Concerns\UsesLandlordConnection;

class Tenant extends Model
{
    use UsesLandlordConnection;

    protected $fillable = [
        'name',
        'agency_id',
        'domain',
        'database',
        'is_active',
    ];



    protected static function booted()
{
    static::creating(function ($tenant) {
        if (empty($tenant->agency_id)) {
            $lastTenant = self::whereNotNull('agency_id')
                ->orderBy('created_at', 'desc')
                ->first();

            $nextNumber = 1;

            if ($lastTenant && preg_match('/AGY(\d+)/', $lastTenant->agency_id, $matches)) {
                $nextNumber = ((int) $matches[1]) + 1;
            }

            $tenant->agency_id = 'AGY' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
        }
    });
}


public function profile()
{
    return $this->hasOne(AgencyProfile::class, 'tenant_id');
}

public function documents()
{
    return $this->hasMany(AgencyDocument::class, 'tenant_id');
}


}