<?php

namespace App\Services;

use Exception;
use Spatie\Permission\Models\Permission;
use App\Models\Role;

class RoleService
{
    /**
     * Search roles with their permissions
     */
    /**
     * The model that owns roles for the current session:
     * the signed-in Agency, or null for a superadmin.
     */
    public function currentAgency(): ?\App\Models\Agency
    {
        $agencyUser = \Illuminate\Support\Facades\Auth::guard('agency')->user();

        return $agencyUser?->agency;
    }

    public function searchRoles(string $search = '', int $perPage = 15)
    {
        $query = Role::withCount('permissions')->with(['permissions', 'creator']);

        if ($agency = $this->currentAgency()) {
            // An agency only ever sees the roles it created.
            $query->where('creator_type', \App\Models\Agency::class)
                  ->where('creator_id', $agency->id);
        } else {
            // Superadmin sees its own roles, not any agency's.
            $query->where(function ($q) {
                $q->where('creator_type', \App\Models\User::class)
                  ->orWhereNull('creator_type');
            });
        }

        if (!empty($search)) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * All permissions grouped by module (the part before the dot)
     */
    public function permissionsByModule(): array
    {
        $query = Permission::orderBy('name');

        // An agency can only hand out permissions it has itself.
        if ($agency = $this->currentAgency()) {
            $query->whereIn('name', $agency->permissions->pluck('name'));
        }

        return $query->get()
            ->groupBy(fn ($permission) => explode('.', $permission->name)[0])
            ->map(fn ($group) => $group->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'action' => explode('.', $p->name)[1] ?? $p->name,
            ])->values())
            ->toArray();
    }

    /**
     * Fetch a role the current session is allowed to touch.
     * An agency may only reach roles it created.
     */
    public function getRole(string $uid): Role
    {
        $role = Role::with('permissions')->where('uid', $uid)->firstOrFail();

        $agency = $this->currentAgency();

        if ($agency && !$this->ownedBy($role, $agency)) {
            throw new Exception('You do not have permission to access this role.');
        }

        return $role;
    }

    private function ownedBy(Role $role, \App\Models\Agency $agency): bool
    {
        return $role->creator_type === \App\Models\Agency::class
            && (int) $role->creator_id === (int) $agency->id;
    }

    public function createRole(array $data): Role
    {
        try {
            // Stamp the creator: the signed-in agency, else the superadmin user.
            $agency = $this->currentAgency();

            // Roles are assigned to staff, and staff authenticate on
            // different guards: agency staff are AgencyUser (guard
            // "agency"), superadmin staff are User (guard "web"). A role
            // must share its assignee's guard, so it is set from the
            // creating session rather than hardcoded.
            $role = Role::create([
                'name' => $data['name'],
                'guard_name' => $agency ? 'agency' : 'web',
                'creator_type' => $agency ? \App\Models\Agency::class : \App\Models\User::class,
                'creator_id' => $agency ? $agency->id : \Illuminate\Support\Facades\Auth::id(),
            ]);

            $role->syncPermissions($data['permissions'] ?? []);

            return $role;
        } catch (Exception $e) {
            throw new Exception('Error creating role: ' . $e->getMessage());
        }
    }

    public function updateRole(Role $role, array $data): Role
    {
        try {
            $role->update(['name' => $data['name']]);
            $role->syncPermissions($data['permissions'] ?? []);

            return $role->fresh('permissions');
        } catch (Exception $e) {
            throw new Exception('Error updating role: ' . $e->getMessage());
        }
    }

    public function deleteRole(Role $role): bool
    {
        if ($role->name === 'superadmin') {
            throw new Exception('The superadmin role cannot be deleted.');
        }

        return (bool) $role->delete();
    }

    /**
     * Validation rules for the role form
     */
    public function rules(?Role $existing = null): array
    {
        return [
            'name' => 'required|string|max:255|unique:roles,name' . ($existing ? ',' . $existing->id : ''),
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ];
    }
}
