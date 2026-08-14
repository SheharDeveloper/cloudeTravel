<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    protected RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index(Request $request)
    {
        $search = (string) ($request->get('search') ?? '');
        $roles = $this->roleService->searchRoles($search, $request->get('per_page', 10));

        return Inertia::render('Admin/Role/Index', [
            'roles' => [
                'data' => $roles->items(),
                'current_page' => $roles->currentPage(),
                'last_page' => $roles->lastPage(),
                'per_page' => $roles->perPage(),
            ],
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Role/Create', [
            'permissionGroups' => $this->roleService->permissionsByModule(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->roleService->rules());

        try {
            $this->roleService->createRole($validated);

            return redirect()->route('admin.roles.index')
                ->with('success', 'Role created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function edit($uid)
    {
        try {
            $role = $this->roleService->getRole($uid);
        } catch (\Exception $e) {
            return redirect()->route('admin.roles.index')
                ->withErrors(['error' => $e->getMessage()]);
        }

        return Inertia::render('Admin/Role/Edit', [
            'role' => [
                'uid' => $role->uid,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name'),
            ],
            'permissionGroups' => $this->roleService->permissionsByModule(),
        ]);
    }

    public function update(Request $request, $uid)
    {
        try {
            $role = $this->roleService->getRole($uid);
        } catch (\Exception $e) {
            return redirect()->route('admin.roles.index')
                ->withErrors(['error' => $e->getMessage()]);
        }

        $validated = $request->validate($this->roleService->rules($role));

        try {
            $this->roleService->updateRole($role, $validated);

            return redirect()->route('admin.roles.index')
                ->with('success', 'Role updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy($uid)
    {
        try {
            $this->roleService->deleteRole($this->roleService->getRole($uid));

            return redirect()->route('admin.roles.index')
                ->with('success', 'Role deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
