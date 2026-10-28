<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactInfo\ContactInfoRequest;
use App\Models\Agency;
use App\Services\AgencyB2BService;
use App\Services\ContactInfoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AgencyB2BController extends Controller
{
    protected AgencyB2BService $agencyB2BService;
    protected ContactInfoService $contactInfoService;

    public function __construct(AgencyB2BService $agencyB2BService, ContactInfoService $contactInfoService)
    {
        $this->agencyB2BService = $agencyB2BService;
        $this->contactInfoService = $contactInfoService;
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
        ] + $this->b2bOptions());
    }

    /**
     * Store a newly created agency in storage
     */
    public function store(Request $request)
    {
        $rules = $this->agencyB2BService->validateStep(4, $request->all());
        $validated = $request->validate($rules, [], $this->b2bAttributes($request));

        // Business verification: at least one document uploaded
        $uploaded = collect($request->file('documents', []))->filter(fn ($doc) => ! empty($doc['file']));
        if ($uploaded->isEmpty()) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'documents' => 'Upload at least one business verification document.',
            ]);
        }

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
        ] + $this->b2bOptions());
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
     * Update the contact info belonging to the specified agency.
     */
    public function updateContactInfo(ContactInfoRequest $request, $uid)
    {
        $agency = $this->agencyB2BService->getAgencyByUid($uid);

        try {
            $this->contactInfoService->save($request->payload(), $agency);
            return back()->with('success', 'Contact information updated successfully');
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
        ] + $this->b2bOptions());
    }

    /**
     * Update the specified agency in storage
     */
    public function update(Request $request, $uid)
    {
        $agency = Agency::where('uid', $uid)->firstOrFail();
        $rules = $this->agencyB2BService->validateStep(4, $request->all(), $agency);
        $validated = $request->validate($rules, [], $this->b2bAttributes($request));

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

    /** Field names in error messages, the tax one named as Tax Setup names it for the country (e.g. "GST number"). */
    private function b2bAttributes(Request $request): array
    {
        $tax = \App\Models\TaxSetup::whereHas('country', fn ($q) => $q->where('countryName', $request->input('registration_country')))
            ->value('tax_name') ?? 'tax';

        return [
            'vat_number' => "{$tax} registration number",
            'vat_registered' => "{$tax} registered",
            'registration_country' => 'country of registration',
            'branches_count' => 'number of branches',
            'expected_monthly_bookings' => 'expected monthly booking volume',
            'payment_terms' => 'payment terms',
            'authorised_rep_name' => 'authorised representative name',
            'authorised_rep_position' => 'authorised representative position',
            'contact_name' => 'main contact name',
            'contact_position' => 'main contact position',
            'terms_accepted' => 'B2B Agreement and platform terms',
        ];
    }

    /** The choices on the B2B registration fields of the agency form. */
    private function b2bOptions(): array
    {
        return [
            'currencies' => config('currency.list', []),
            // For the searchable country box (flag, name and code); flags by plain path, as on application forms
            'countries' => \App\Models\Country::orderBy('countryName')->get(['id', 'countryName', 'countryCode'])
                ->filter(fn ($c) => $c->countryName)
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'countryName' => $c->countryName,
                    'countryCode' => (string) $c->countryCode,
                    'flag_url' => '/assets/flags/64x48/' . strtolower((string) $c->countryCode) . '.png',
                ])->values(),
            'monthlyBookings' => Agency::MONTHLY_BOOKINGS,
            'paymentTerms' => Agency::PAYMENT_TERMS,
            'documentTypes' => Agency::DOCUMENT_TYPES,
            // Country name => its tax's name (Tax Setup), e.g. India => GST, United Kingdom => VAT
            'taxNames' => \App\Models\TaxSetup::with('country')->get()
                ->filter(fn ($t) => $t->country)
                ->mapWithKeys(fn ($t) => [$t->country->countryName => $t->tax_name]),
        ];
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
            $validated = $request->validate($rules, [], $this->b2bAttributes($request));
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
