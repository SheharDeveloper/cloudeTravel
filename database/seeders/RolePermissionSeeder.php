<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use App\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Modules that permissions are generated for.
     * Each gets view / create / edit / delete.
     */
    private const MODULES = [
        'staff',
        'client',
        'agency',
        'booking',
        'contact-request',
        'visa',
        'package',
        'service',
        'document',
        'travel-quote',
        'special-offer',
        'settings',
        'role',
    ];

    private const ACTIONS = ['view', 'create', 'edit', 'delete'];

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Seeded on both guards: superadmin-side roles authenticate on
        // "web", agency-side roles (assigned to AgencyUser) on "agency" —
        // a role can only be synced with permissions sharing its guard.
        foreach (self::MODULES as $module) {
            foreach (self::ACTIONS as $action) {
                foreach (['web', 'agency'] as $guard) {
                    Permission::firstOrCreate([
                        'name' => "{$module}.{$action}",
                        'guard_name' => $guard,
                    ]);
                }
            }
        }

        // The first user in the system is the super admin, and owns the
        // roles seeded below via the polymorphic creator.
        $firstUser = User::orderBy('id')->first();

        $creator = $firstUser
            ? ['creator_type' => User::class, 'creator_id' => $firstUser->id]
            : [];

        // Super admin: every web-guard permission.
        $superadmin = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web'], $creator);
        $superadmin->forceFill($creator)->save();
        $superadmin->syncPermissions(Permission::where('guard_name', 'web')->get());

        // Staff: read-only by default; widen per deployment.
        $staff = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web'], $creator);
        $staff->forceFill($creator)->save();
        $staff->syncPermissions(
            Permission::where('guard_name', 'web')->where('name', 'like', '%.view')->get()
        );

        if ($firstUser && !$firstUser->hasRole('superadmin')) {
            $firstUser->assignRole($superadmin);
        }
    }
}
