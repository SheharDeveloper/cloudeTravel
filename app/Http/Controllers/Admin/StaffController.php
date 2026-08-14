<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AddressService;
use App\Services\StaffService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StaffController extends Controller
{
    protected StaffService $staffService;

    public function __construct(StaffService $staffService)
    {
        $this->staffService = $staffService;
    }

    /**
     * Display a listing of staff
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
   
        $search = (string) ($request->get('search') ?? '');

        $staff = $this->staffService->searchStaff($search, $perPage);

        return Inertia::render('Admin/Staff/Index', [
            'staff' => [
                'data' => $staff->items(),
                'current_page' => $staff->currentPage(),
                'last_page' => $staff->lastPage(),
                'per_page' => $staff->perPage(),
            ],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new staff member
     */
    public function create()
    {
        $addressService = new AddressService();

        return Inertia::render('Admin/Staff/Create', [
            'zipCodes' => $addressService->getZipCodesForDropdown(),
            'addressData' => $addressService->getAllAddressData(),
            'currencies' => config('currency.list'),
        ]);
    }

    /**
     * Store a newly created staff member in storage
     */
    public function store(Request $request)
    {
        $rules = $this->staffService->validateStep(0, $request->all());
        $validated = $request->validate($rules);

        return DB::transaction(function () use ($request, $validated) {
            $validated['password'] = bcrypt($validated['password']);

            if ($request->hasFile('profile_pic')) {
                $validated['profile_pic'] = $this->staffService->uploadPhoto($request->file('profile_pic'));
            }

            foreach (['front_image', 'back_image'] as $img) {
                if ($request->hasFile($img)) {
                    $validated[$img] = $this->staffService->uploadFile($request->file($img), 'staff-passports');
                }
            }

            $validated['educations'] = $this->collectEducations($request);
            $validated['documents'] = $this->collectDocuments($request);

            $this->staffService->createStaff($validated);

            return redirect()->route('admin.staff.index')
                ->with('success', 'Staff member created successfully');
        });
    }

    /**
     * Display the specified staff member
     */
    public function show($uid)
    {
        $staff = $this->staffService->findByUid($uid);
        $staff = $this->staffService->getStaffById($staff);
        

        return Inertia::render('Admin/Staff/Show', [
            'staff' => $staff,
            'availableRoles' => $this->staffService->availableRoles($staff)->pluck('name'),
        ]);
    }

    /**
     * Assign a role to a staff member
     */
    public function assignRole(Request $request, $uid)
    {
        $staff = $this->staffService->findByUid($uid);

        $validated = $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        try {
            $this->staffService->assignRole($staff, $validated['role']);

            return back()->with('success', 'Role assigned successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Reset a staff member's password
     */
    public function resetPassword(Request $request, $uid)
    {
        $staff = $this->staffService->findByUid($uid);

        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            $this->staffService->resetPassword($staff, $validated['password']);

            return back()->with('success', 'Password reset successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified staff member
     */
    public function edit($uid)
    {
        $staff = $this->staffService->findByUid($uid);
        $addressService = new AddressService();

        return Inertia::render('Admin/Staff/Edit', [
            'staff' => $this->staffService->getStaffById($staff),
            'zipCodes' => $addressService->getZipCodesForDropdown(),
            'addressData' => $addressService->getAllAddressData(),
            'currencies' => config('currency.list'),
        ]);
    }

    /**
     * Update the specified staff member in storage
     */
    public function update(Request $request, $uid)
    {
        $staff = $this->staffService->findByUid($uid);
        $rules = $this->staffService->validateStep(0, $request->all(), $staff);
        $validated = $request->validate($rules);

        return DB::transaction(function () use ($request, $validated, $staff) {
            if (!empty($validated['password'])) {
                $validated['password'] = bcrypt($validated['password']);
            } else {
                unset($validated['password']);
            }

            if ($request->hasFile('profile_pic')) {
                $validated['profile_pic'] = $this->staffService->uploadPhoto($request->file('profile_pic'));
            } else {
                unset($validated['profile_pic']);
            }

            foreach (['front_image', 'back_image'] as $img) {
                if ($request->hasFile($img)) {
                    $validated[$img] = $this->staffService->uploadFile($request->file($img), 'staff-passports');
                }
            }

            $validated['educations'] = $this->collectEducations($request);
            $validated['documents'] = $this->collectDocuments($request);

            $this->staffService->updateStaff($staff, $validated);

            return redirect()->route('admin.staff.index')
                ->with('success', 'Staff member updated successfully');
        });
    }

    /**
     * Remove the specified staff member from storage
     */
    public function destroy($uid)
    {
        try {
            $staff = $this->staffService->findByUid($uid);
            $this->staffService->deleteStaff($staff);

            return redirect()->route('admin.staff.index')
                ->with('success', 'Staff member deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Toggle staff status
     */
    public function toggleStatus($uid)
    {
        try {
            $staff = $this->staffService->findByUid($uid);
            $this->staffService->toggleStatus($staff);

            return back()->with('success', 'Staff status updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Log in as the specified staff member
     */
    public function impersonate($uid)
    {
        try {
            $staff = $this->staffService->findByUid($uid);
            $this->staffService->impersonate($staff);

            return redirect('/dashboard')->with('success', "You are now viewing as {$staff->name}");
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Return to the account that started the impersonation session
     */
    public function stopImpersonating()
    {
        try {
            $actor = $this->staffService->stopImpersonating();

            return redirect('/dashboard')->with('success', "Returned to {$actor->name}'s account");
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete a single education row
     */
    public function deleteEducation($id)
    {
        try {
            $this->staffService->deleteEducation($id);
            return back()->with('success', 'Education record deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete a single tax / deduction row
     */
    public function deleteTaxDeduction($id)
    {
        try {
            $this->staffService->deleteTaxDeduction($id);
            return back()->with('success', 'Record deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete a single document row
     */
    public function deleteDocument($id)
    {
        try {
            $this->staffService->deleteDocument($id);
            return back()->with('success', 'Document deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Validate a specific step of the form
     */
    public function validateFormStep(Request $request)
    {
        $step = (int) $request->get('step');

        $existingStaff = null;

        if ($request->has('staff_uid')) {
            try {
                $existingStaff = $this->staffService->findByUid($request->get('staff_uid'));
            } catch (\Exception $e) {
                $existingStaff = null;
            }
        }

        $rules = $this->staffService->validateStep($step, $request->all(), $existingStaff);

        try {
            $request->validate($rules);

            return response()->json([
                'success' => true,
                'message' => 'Step validation passed',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Merge uploaded education photos back into the education rows
     */
    private function collectEducations(Request $request): array
    {
        $educations = [];

        foreach ($request->input('educations', []) as $index => $education) {
            $educations[$index] = [
                'name' => $education['name'] ?? '',
                'photo' => $request->file("educations.{$index}.photo"),
            ];
        }

        return $educations;
    }

    /**
     * Merge uploaded document files back into the document rows
     */
    private function collectDocuments(Request $request): array
    {
        $documents = [];

        foreach ($request->input('documents', []) as $index => $document) {
            $documents[$index] = [
                'document_name' => $document['document_name'] ?? '',
                'document_type' => $document['document_type'] ?? '',
                'file' => $request->file("documents.{$index}.file"),
            ];
        }

        return $documents;
    }
}
