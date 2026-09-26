<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\Tenant;
use App\Models\Domain;
use App\Services\ContactInfoService;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AgencyB2BService
{
    public function __construct(private ContactInfoService $contactInfoService)
    {
    }

    /**
     * Get all agencies with pagination
     */
    public function getAllAgencies(int $perPage = 15)
    {
        return Agency::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Search agencies by name, email, or phone
     */
    public function searchAgencies(string $search = '', int $perPage = 15)
    {
        $query = Agency::with('user', 'agencyServices', 'agencyDocuments');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('agency_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%")
                  ->orWhere('legal_name', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Look up an agency by its public uid.
     */
    public function getAgencyByUid(string $uid): Agency
    {
        return Agency::where('uid', $uid)->firstOrFail();
    }

    /**
     * Get single agency by ID with relationships
     */
    public function getAgencyById(Agency $agency)
    {
        $agency->load('user', 'agencyDocuments', 'agencyServices', 'permissions', 'contactInfo');

        // Load domain name if agency has a domain
        if ($agency->tenant_id) {
            $domain = Domain::where('tenant_id', $agency->tenant_id)->where('type', 'subdomain')->first();
            if ($domain) {
                $agency->domain_name = $domain->domain;
            }

            // The same tenant's type=path row (see createAgency/updateAgency)
            // is the actual URL the agency's site is reachable at — unless
            // the domain looks like a real hostname (has a dot), in which
            // case RewriteTenantPathPrefix redirects /{domain} to its own
            // subdomain, so that's the URL to show instead.
            $pathDomain = Domain::where('tenant_id', $agency->tenant_id)->where('type', 'path')->first();
            if ($pathDomain) {
                $appUrl = rtrim(config('app.url'), '/');

                $agency->tenant_url = str_contains($pathDomain->domain, '.')
                    ? parse_url($appUrl, PHP_URL_SCHEME) . '://' . $pathDomain->domain
                        . (parse_url($appUrl, PHP_URL_PORT) ? ':' . parse_url($appUrl, PHP_URL_PORT) : '') . '/'
                    : $appUrl . '/' . $pathDomain->domain;
            }
        }

        return $agency;
    }

    /**
     * Handle logo file upload
     */
    public function uploadLogo(UploadedFile $logo): string
    {
        try {
            $path = $logo->store('agency-logos', 'public');
            return '/storage/' . $path;
        } catch (Exception $e) {
            throw new Exception('Error uploading logo: ' . $e->getMessage());
        }
    }

    /**
     * Handle document file upload
     */
    public function uploadDocument(UploadedFile $document): string
    {
        try {
            $path = $document->store('agency-documents', 'public');
            return '/storage/' . $path;
        } catch (Exception $e) {
            throw new Exception('Error uploading document: ' . $e->getMessage());
        }
    }

    /**
     * Store agency documents
     */
    public function storeAgencyDocuments(int $agencyId, array $documents): void
    {
        if (empty($documents) || !is_array($documents)) {
            return;
        }

        foreach ($documents as $doc) {
            if (isset($doc['file']) && !empty($doc['file'])) {
                $filePath = $this->uploadDocument($doc['file']);

                \App\Models\AgencyDocument::create([
                    'agency_id' => $agencyId,
                    'document_name' => $doc['document_name'] ?? '',
                    'document_type' => $doc['document_type'] ?? '',
                    'file_path' => $filePath,
                ]);
            }
        }
    }

    /**
     * Create the agency's owner login.
     * The default password is the agency email itself, so the agency can
     * sign in immediately and change it afterwards.
     */
    public function createAgencyUser(Agency $agency): ?\App\Models\AgencyUser
    {
        if (empty($agency->email)) {
            return null;
        }

        if (\App\Models\AgencyUser::where('email', $agency->email)->exists()) {
            return null;
        }

        return \App\Models\AgencyUser::create([
            'agency_id' => $agency->id,
            'name' => $agency->agency_name,
            'email' => $agency->email,
            'phone' => $agency->phone_number,
            'profile_pic' => $agency->logo,
            'password' => $agency->email,
            'is_owner' => true,
            'status' => 'active',
        ]);
    }

    /**
     * Store agency services
     */
    public function storeAgencyServices(int $agencyId, array $services): void
    {
        if (empty($services) || !is_array($services)) {
            return;
        }

        \App\Models\AgencyService::where('agency_id', $agencyId)->delete();

        foreach ($services as $service) {
            if (!empty($service)) {
                \App\Models\AgencyService::create([
                    'agency_id' => $agencyId,
                    'service_name' => $service,
                    'status' => 1,
                ]);
            }
        }
    }

    /**
     * Create a new agency
     */
    public function createAgency(array $data): Agency
    {
        try {
            $has_domain = $data['has_domain'] ?? false;
            $domain_name = $data['domain_name'] ?? null;

            if ($has_domain && !empty($domain_name)) {
                $tenant = Tenant::create([
                    'name' => $domain_name,
                    'slug' => Str::slug($domain_name),
                    'status' => 'active',
                    'plan' => 'premium',
                ]);

                Domain::create([
                    'domain' => $domain_name,
                    'tenant_id' => $tenant->id,
                    'type' => 'subdomain',
                    'is_primary' => true,
                    'verified_at' => now(),
                    'ssl_status' => 'active',
                ]);

                // Same agency, reachable at http://127.0.0.1:8000/{domain_name}
                // too — RewriteTenantPathPrefix looks up type=path rows the
                // same way ResolveTenantFromDomain looks up type=subdomain
                // rows, so no separate step is needed to enable this.
                Domain::create([
                    'domain' => $domain_name,
                    'tenant_id' => $tenant->id,
                    'type' => 'path',
                    'is_primary' => false,
                    'verified_at' => now(),
                    'ssl_status' => 'active',
                ]);

                $data['tenant_id'] = $tenant->id;
            } else {
                $data['tenant_id'] = null;
            }

            unset($data['domain_name']);

            // Extract documents and services before creating agency
            $documents = $data['documents'] ?? [];
            $services = $data['services'] ?? [];
            unset($data['documents']);
            unset($data['services']);

            $agency = Agency::create($data);

            $this->storeAgencyDocuments($agency->id, $documents);
            $this->storeAgencyServices($agency->id, $services);
            $this->createAgencyUser($agency);
            $this->contactInfoService->createDefaultForAgency($agency);

            return $agency;
        } catch (Exception $e) {
            throw new Exception('Error creating agency: ' . $e->getMessage());
        }
    }

    /**
     * Update an agency
     */
    public function updateAgency(Agency $agency, array $data): Agency
    {
        try {
            $has_domain = $data['has_domain'] ?? false;
            $domain_name = $data['domain_name'] ?? null;

            if ($has_domain && !empty($domain_name)) {
                if (!$agency->tenant_id) {
                    $tenant = Tenant::create([
                        'name' => $domain_name,
                        'slug' => Str::slug($domain_name),
                        'status' => 'active',
                        'plan' => 'premium',
                    ]);

                    Domain::create([
                        'domain' => $domain_name,
                        'tenant_id' => $tenant->id,
                        'type' => 'subdomain',
                        'is_primary' => true,
                        'verified_at' => now(),
                        'ssl_status' => 'active',
                    ]);

                    Domain::create([
                        'domain' => $domain_name,
                        'tenant_id' => $tenant->id,
                        'type' => 'path',
                        'is_primary' => false,
                        'verified_at' => now(),
                        'ssl_status' => 'active',
                    ]);

                    $data['tenant_id'] = $tenant->id;
                } else {
                    // The agency already has a tenant/domain — update the
                    // existing records in place instead of silently
                    // ignoring the edited domain name. Both the subdomain
                    // and path row (if it exists yet) move to the new name;
                    // updateOrCreate covers agencies that predate this /{slug}
                    // feature and don't have a path row yet.
                    Domain::where('tenant_id', $agency->tenant_id)->where('type', 'subdomain')->update(['domain' => $domain_name]);
                    Domain::updateOrCreate(
                        ['tenant_id' => $agency->tenant_id, 'type' => 'path'],
                        ['domain' => $domain_name, 'is_primary' => false, 'verified_at' => now(), 'ssl_status' => 'active'],
                    );

                    Tenant::where('id', $agency->tenant_id)->update([
                        'name' => $domain_name,
                        'slug' => Str::slug($domain_name),
                    ]);
                }
            } else {
                $data['tenant_id'] = null;
            }

            unset($data['domain_name']);

            // Extract documents and services before updating agency
            $documents = $data['documents'] ?? [];
            $services = $data['services'] ?? [];
            unset($data['documents']);
            unset($data['services']);

            $filteredData = array_filter($data, fn($value) => !is_null($value) && $value !== '');
            $agency->update($filteredData);

            $this->storeAgencyDocuments($agency->id, $documents);
            $this->storeAgencyServices($agency->id, $services);

            return $agency->fresh();
        } catch (Exception $e) {
            throw new Exception('Error updating agency: ' . $e->getMessage());
        }
    }

    /**
     * Delete an agency
     */
    public function deleteAgency(Agency $agency): bool
    {
        try {
            return $agency->delete();
        } catch (Exception $e) {
            throw new Exception('Error deleting agency: ' . $e->getMessage());
        }
    }

    /**
     * Delete an agency document
     */
    public function deleteDocument(int $documentId): bool
    {
        try {
            $document = \App\Models\AgencyDocument::findOrFail($documentId);
            return $document->delete();
        } catch (Exception $e) {
            throw new Exception('Error deleting document: ' . $e->getMessage());
        }
    }

    /**
     * Toggle agency status (active/inactive)
     * Also updates associated tenant status if available
     */
    public function toggleStatus(Agency $agency): Agency
    {
        try {
            $newStatus = !$agency->status;
            $agency->update(['status' => $newStatus]);

            // If agency has a tenant, update tenant status accordingly
            if ($agency->tenant_id) {
                $tenant = Tenant::find($agency->tenant_id);
                if ($tenant) {
                    $tenantStatus = $newStatus ? 'active' : 'inactive';
                    $tenant->update(['status' => $tenantStatus]);
                }
            }

            return $agency->fresh();
        } catch (Exception $e) {
            throw new Exception('Error toggling agency status: ' . $e->getMessage());
        }
    }


    /**
     * Validate specific step of agency form or all fields for submission
     */
    public function validateStep(int $step, array $data, ?Agency $existingAgency = null): array
    {
        $rules = [];

        switch ($step) {
            case 1:
                // Step 1 - Basic Info validation
                // For edits: logo is optional (only if provided), for creates: logo is required
                $logoRule = $existingAgency
                    ? 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120|dimensions:min_width=200,min_height=200'
                    : 'required|image|mimes:jpeg,png,jpg,gif|max:5120|dimensions:min_width=200,min_height=200';

                $rules = [
                    'agency_name' => 'required|string|max:255',
                    'legal_name' => 'required|string|max:255',
                    'email' => 'required|email|unique:agencies,email' . ($existingAgency ? ',' . $existingAgency->id : ''),
                    'phone_number' => 'required|string|max:20',
                    'logo' => $logoRule,
                    'has_domain' => 'nullable|boolean',
                    'domain_name' => ['required', 'string', 'max:255', $this->uniqueDomainRule($existingAgency)],
                ];
                break;

            case 2:
                // Step 2 - Address validation
                $rules = [
                    'country' => 'required|string|max:255',
                    'zip_code_id' => 'required|string|max:255',
                    'address_id' => 'required|string|max:255',
                    'street_id' => 'required|string|max:255',
                    'county' => 'nullable|string|max:255',
                ];
                break;

            case 3:
                // Step 3 - Other Info validation
                $rules = [
                    'services' => 'required|array|min:1',
                    'tax_status' => 'nullable|integer|in:0,1',
                    'registration_number' => 'nullable|string|max:255',
                    'gst_number' => 'nullable|string|max:255|regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/',
                    'pan_number' => 'nullable|string|max:255|regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/',
                    'account_number' => 'nullable|string|max:255|regex:/^[0-9]{9,18}$/',
                    'ifsc_code' => 'nullable|string|max:255|regex:/^[A-Z]{4}0[A-Z0-9]{6}$/',
                    'note' => 'nullable|string|max:1000',
                ];
                break;

            case 4:
                // Step 4 - Full validation for submission (all required fields)
                // For edits: logo is optional (only if provided), for creates: logo is required
                $logoRule = $existingAgency
                    ? 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120|dimensions:min_width=200,min_height=200'
                    : 'required|image|mimes:jpeg,png,jpg,gif|max:5120|dimensions:min_width=200,min_height=200';

                $rules = [
                    'agency_name' => 'required|string|max:255',
                    'legal_name' => 'required|string|max:255',
                    'email' => 'required|email|unique:agencies,email' . ($existingAgency ? ',' . $existingAgency->id : ''),
                    'phone_number' => 'required|string|max:20',
                    'country' => 'required|string|max:255',
                    'zip_code_id' => 'required|string|max:255',
                    'address_id' => 'required|string|max:255',
                    'street_id' => 'required|string|max:255',
                    'logo' => $logoRule,
                    'registration_number' => 'nullable|string|max:255',
                    'gst_number' => 'nullable|string|max:255|regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/',
                    'pan_number' => 'nullable|string|max:255|regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/',
                    'account_number' => 'nullable|string|max:255|regex:/^[0-9]{9,18}$/',
                    'ifsc_code' => 'nullable|string|max:255|regex:/^[A-Z]{4}0[A-Z0-9]{6}$/',
                    'note' => 'nullable|string|max:1000',
                    'services' => 'required|array|min:1',
                    'services.*' => 'nullable|string',
                    'has_domain' => 'nullable|boolean',
                    'tax_status' => 'nullable|integer|in:0,1',
                    'state' => 'nullable|string|max:255',
                    'city' => 'nullable|string|max:255',
                    'county' => 'nullable|string|max:255',
                    'address' => 'nullable|string|max:500',
                    'domain_name' => ['required', 'string', 'max:255', $this->uniqueDomainRule($existingAgency)],
                ];
                break;
        }

        return $rules;
    }

    /**
     * A domain is always required now, and must be unique — but editing an
     * agency shouldn't reject its own existing domain value, so its own
     * tenant's rows (the subdomain + path pair createAgency/updateAgency
     * always create together) are excluded from the uniqueness check.
     */
    private function uniqueDomainRule(?Agency $existingAgency)
    {
        return Rule::unique('domains', 'domain')->where(function ($query) use ($existingAgency) {
            if ($existingAgency?->tenant_id) {
                $query->where('tenant_id', '!=', $existingAgency->tenant_id);
            }
        });
    }
}
