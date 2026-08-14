<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    protected $fillable = ['uid', 'name', 'guard_name', 'creator_type', 'creator_id'];

    protected static function booted(): void
    {
        static::creating(function ($role) {
            if (empty($role->uid)) {
                $role->uid = \Illuminate\Support\Str::uuid();
            }
        });
    }

    /**
     * Who created the role: App\Models\User (superadmin) or App\Models\Agency.
     */
    public function creator()
    {
        return $this->morphTo();
    }

    /**
     * Label for the roles table: agencies are identified by name + id,
     * superadmin users just by the model.
     */
    public function getCreatorLabelAttribute(): string
    {
        if (!$this->creator) {
            return 'System';
        }

        if ($this->creator instanceof Agency) {
            return $this->creator->agency_name . ' (#' . $this->creator->id . ')';
        }

        return 'Superadmin';
    }
}
