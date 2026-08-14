<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Services\AgencyB2BService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AgencyB2BController extends Controller
{
    protected AgencyB2BService $agencyB2BService;

    public function __construct(AgencyB2BService $agencyB2BService)
    {
        $this->agencyB2BService = $agencyB2BService;
    }

    /**
     * Display a listing of agencies
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search = (string) ($request->get('search') ?? '');

        $agencies = $this->agencyB2BService->searchAgencies($search, $perPage);

        return Inertia::render('Admin/AgencyB2B/Index', [
            'agencies' => [
                'data' => $agencies->items(),
                'current_page' => $agencies->currentPage(),
                'last_page' => $agencies->lastPage(),
                'per_page' => $agencies->perPage(),
            ],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new agency
     */
    public function create()
    {
        $services = config('services.types');
        $addressService = new \App\Services\AddressService();
        $zipCodes = $addressService->getZipCodesForDropdown();
        $addressData = $addressService->getAllAddressData();

        return Inertia::render('Admin/AgencyB2B/Create', [
            'services' => $services,
            'zipCodes' => $zipCodes,
            'addressData' => $addressData,
        ]);
    }

    /**
     * Store a newly created agency in storage
     */
    public function store(Request $request)
    {
        $rules = $this->agencyB2BService->validateStep(4, $request->all());
        $validated = $request->validate($rules);

        return DB::transaction(function () use ($request, $validated) {
            try {
                $validated['user_id'] = auth()->id();

                if ($request->hasFile('logo')) {
                    $validated['logo'] = $this->agencyB2BService->uploadLogo($request->file('logo'));
                }

                $documents = [];
                if ($request->has('documents')) {
                    $docInputs = $request->input('documents', []);
                    foreach ($docInputs as $index => $doc) {
                        $documents[$index] = [
                            'document_name' => $doc['document_name'] ?? '',
                            'document_type' => $doc['document_type'] ?? '',
                            'file' => $request->file("documents.{$index}.file"),
                        ];
                    }
                }
                if (!empty($documents)) {
                    $validated['documents'] = $documents;
                }

                $this->agencyB2BService->createAgency($validated);
                return redirect()->route('admin.agency-b2b.index')
                    ->with('success', 'Agency created successfully');
            } catch (\Exception $e) {
                throw $e;
            }
        });
    }

    /**
     * Display the specified agency
     */
    public function show($uid)
    {
        $agency = Agency::where('uid', $uid)->firstOrFail();
        $agency = $this->agencyB2BService->getAgencyById($agency);

        return Inertia::render('Admin/AgencyB2B/Show', [
            'agency' => $agency,
            'permissionGroups' => app(\App\Services\RoleService::class)->permissionsByModule(),
        ]);
    }

    /**
     * Grant / revoke the permissions held by an agency.
     */
    public function updatePermissions(Request $request, $uid)
    {
        $agency = Agency::where('uid', $uid)->firstOrFail();

        $validated = $request->validate([
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        try {
            $agency->syncPermissions($validated['permissions'] ?? []);

            return back()->with('success', 'Agency permissions updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified agency
     */
    public function edit($uid)
    {
        $agency = Agency::where('uid', $uid)->firstOrFail();
        $agency = $this->agencyB2BService->getAgencyById($agency);

        $services = config('services.types');
        $addressService = new \App\Services\AddressService();
        $zipCodes = $addressService->getZipCodesForDropdown();
        $addressData = $addressService->getAllAddressData();

        return Inertia::render('Admin/AgencyB2B/Edit', [
            'agency' => $agency,
            'services' => $services,
            'zipCodes' => $zipCodes,
            'addressData' => $addressData,
        ]);
    }

    /**
     * Update the specified agency in storage
     */
    public function update(Request $request, $uid)
    {
        $agency = Agency::where('uid', $uid)->firstOrFail();
        $rules = $this->agencyB2BService->validateStep(4, $request->all(), $agency);
        $validated = $request->validate($rules);

        return DB::transaction(function () use ($request, $validated, $agency) {
            try {
                if ($request->hasFile('logo')) {
                    $validated['logo'] = $this->agencyB2BService->uploadLogo($request->file('logo'));
                }

                $documents = [];
                if ($request->has('documents')) {
                    $docInputs = $request->input('documents', []);
                    foreach ($docInputs as $index => $doc) {
                        $documents[$index] = [
                            'document_name' => $doc['document_name'] ?? '',
                            'document_type' => $doc['document_type'] ?? '',
                            'file' => $request->file("documents.{$index}.file"),
                        ];
                    }
                }
                if (!empty($documents)) {
                    $validated['documents'] = $documents;
                }

                $this->agencyB2BService->updateAgency($agency, $validated);
                return redirect()->route('admin.agency-b2b.index')
                    ->with('success', 'Agency updated successfully');
            } catch (\Exception $e) {
                throw $e;
            }
        });
    }

    /**
     * Remove the specified agency from storage
     */
    public function destroy($uid)
    {
        try {
            $agency = Agency::where('uid', $uid)->firstOrFail();
            $this->agencyB2BService->deleteAgency($agency);
            return redirect()->route('admin.agency-b2b.index')
                ->with('success', 'Agency deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Toggle agency status
     */
    public function toggleStatus($uid)
    {
        try {
            $agency = Agency::where('uid', $uid)->firstOrFail();
            $this->agencyB2BService->toggleStatus($agency);
            return back()->with('success', 'Agency status updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete an agency document
     */
    public function deleteDocument($id)
    {
        try {
            $this->agencyB2BService->deleteDocument($id);
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
        $step = $request->get('step');
        $data = $request->all();

        // Check if this is an edit by looking for agency_uid
        $existingAgency = null;
        if ($request->has('agency_uid')) {
            $existingAgency = Agency::where('uid', $request->get('agency_uid'))->first();
        }

        $rules = $this->agencyB2BService->validateStep($step, $data, $existingAgency);

        try {
            $validated = $request->validate($rules);
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
}
