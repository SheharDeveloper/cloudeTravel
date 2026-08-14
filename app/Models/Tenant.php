<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Spatie\Multitenancy\Models\Concerns\UsesLandlordConnection;
use Spatie\Multitenancy\TenantCollection;

class Tenant extends Model
{
    use UsesLandlordConnection;

    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'plan',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];



    protected static function booted(): void
    {
        static::creating(function ($tenant) {
            if (empty($tenant->uuid)) {
                $tenant->uuid = \Illuminate\Support\Str::uuid();
            }
        });
    }

    public function newCollection(array $models = []): TenantCollection
    {
        return new TenantCollection($models);
    }


public function profile()
{
    return $this->hasOne(AgencyProfile::class, 'tenant_id');
}

public function documents()
{
    return $this->hasMany(AgencyDocument::class, 'tenant_id');
}

public function domains()
{
    return $this->hasMany(Domain::class);
}

public function primaryDomain()
{
    return $this->hasOne(Domain::class)->where('is_primary', true);
}


}