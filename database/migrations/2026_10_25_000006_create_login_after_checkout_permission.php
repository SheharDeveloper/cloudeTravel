<?php

use App\Services\AttendanceService;
use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

/**
 * "Login after checkout": a staff member whose role has it may sign back in
 * the same day after checking out; without it they can't until tomorrow.
 */
return new class extends Migration
{
    public function up(): void
    {
        foreach (['web', 'agency'] as $guard) {
            Permission::firstOrCreate(['name' => AttendanceService::LOGIN_AFTER_CHECKOUT, 'guard_name' => $guard]);
        }

        // The superadmin role holds every web permission
        \App\Models\Role::where('name', 'superadmin')->where('guard_name', 'web')->first()
            ?->givePermissionTo(AttendanceService::LOGIN_AFTER_CHECKOUT);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function down(): void
    {
        Permission::where('name', AttendanceService::LOGIN_AFTER_CHECKOUT)->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
