<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\AgencyUser;
use App\Models\Role;
use App\Models\StaffActivityLog;
use App\Models\StaffDocument;
use App\Models\StaffEducation;
use App\Models\StaffEmergencyContact;
use App\Models\StaffPassport;
use App\Models\StaffPayment;
use App\Models\StaffProfile;
use App\Models\StaffTaxDeduction;
use App\Models\User;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;

class StaffService
{
    protected RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Relationships loaded for detail / edit screens
     */
    private const RELATIONS = [
        'staffProfile',
        'staffPayment',
        'staffPassport',
        'staffEmergencyContact',
        'staffEducations',
        'staffTaxDeductions',
        'staffDocuments',
        'roles',
    ];

    /**
     * The agency owning the current session, or null for a superadmin.
     */
    public function currentAgency(): ?Agency
    {
        return Auth::guard('agency')->user()?->agency;
    }

    /**
     * Owner attributes stamped onto every staff-related row: the signed-in
     * agency, or the superadmin user.
     */
    private function ownerAttributes(): array
    {
        $agency = $this->currentAgency();

        return [
            'owner_type' => $agency ? Agency::class : User::class,
            'owner_id' => $agency ? $agency->id : Auth::id(),
        ];
    }

    /**
     * Attributes identifying which staff record a related row belongs to.
     */
    private function staffableAttributes(User|AgencyUser $staff): array
    {
        return [
            'staffable_type' => get_class($staff),
            'staffable_id' => $staff->id,
        ];
    }

    /**
     * Search staff belonging to the current session: an agency sees only
     * its own agency_users staff, a superadmin sees only its own users.
     */
    public function searchStaff(string $search = '', int $perPage = 15)
    {
        if ($agency = $this->currentAgency()) {
            $query = AgencyUser::where('agency_id', $agency->id)->where('is_owner', false);
        } else {
            $query = User::where('type', 'staff');
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Resolve a staff member by uid for the current session's guard.
     */
    public function findByUid(string $uid): User|AgencyUser
    {
        if ($this->currentAgency()) {
            return AgencyUser::where('uid', $uid)->firstOrFail();
        }

        return User::where('uid', $uid)->firstOrFail();
    }

    /**
     * Get single staff member with all related records
     */
    public function getStaffById(User|AgencyUser $staff): User|AgencyUser
    {
        $staff->load(self::RELATIONS);

        $staff->setRelation(
            'staffActivityLogs',
            $staff->staffActivityLogs()->with('causer')->latest()->limit(50)->get()
        );

        return $staff;
    }

    /**
     * Who is performing the current action: the signed-in agency user or
     * the signed-in superadmin user.
     */
    private function currentCauser(): User|AgencyUser|null
    {
        return Auth::guard('agency')->user() ?? Auth::guard('web')->user();
    }

    /**
     * Record an entry in the staff member's activity log.
     */
    public function logActivity(User|AgencyUser $staff, string $action, string $description): void
    {
        $causer = $this->currentCauser();

        StaffActivityLog::create(
            $this->staffableAttributes($staff) + [
                'causer_type' => $causer ? get_class($causer) : null,
                'causer_id' => $causer?->id,
                'action' => $action,
                'description' => $description,
            ]
        );
    }

    /**
     * Log in as this staff member, remembering who initiated the switch so
     * they can return to their own account afterwards. An agency may only
     * impersonate its own staff, never another agency's or its own owner
     * login; a superadmin may only impersonate its own staff accounts.
     */
    public function impersonate(User|AgencyUser $staff): void
    {
        if (session()->has('impersonator_id')) {
            throw new Exception('Stop your current impersonation session before starting another.');
        }

        $agency = $this->currentAgency();

        if ($agency) {
            if (!$staff instanceof AgencyUser || (int) $staff->agency_id !== (int) $agency->id || $staff->is_owner) {
                throw new Exception('You can only impersonate your own staff.');
            }

            $actor = Auth::guard('agency')->user();
            $guard = 'agency';
        } else {
            if (!$staff instanceof User || $staff->type !== 'staff') {
                throw new Exception('You can only impersonate staff accounts.');
            }

            $actor = Auth::guard('web')->user();
            $guard = 'web';
        }

        // Logged while still authenticated as the actor, so the causer is
        // attributed correctly before the guard switches below.
        $this->logActivity($staff, 'impersonation_started', "Impersonation started by \"{$actor->name}\"");

        session([
            'impersonator_guard' => $guard,
            'impersonator_id' => $actor->id,
            'impersonator_name' => $actor->name,
        ]);

        Auth::guard($guard)->login($staff);
    }

    /**
     * Return to the account that started the impersonation session.
     */
    public function stopImpersonating(): User|AgencyUser
    {
        $guard = session('impersonator_guard');
        $id = session('impersonator_id');

        if (!$guard || !$id) {
            throw new Exception('No impersonation session is active.');
        }

        $impersonatedStaff = Auth::guard($guard)->user();
        $actor = $guard === 'agency' ? AgencyUser::find($id) : User::find($id);

        if (!$actor) {
            session()->forget(['impersonator_guard', 'impersonator_id', 'impersonator_name']);
            throw new Exception('Could not restore the original account.');
        }

        Auth::guard($guard)->login($actor);
        session()->forget(['impersonator_guard', 'impersonator_id', 'impersonator_name']);

        if ($impersonatedStaff) {
            $this->logActivity($impersonatedStaff, 'impersonation_ended', "Impersonation ended by \"{$actor->name}\"");
        }

        return $actor;
    }   

    /**
     * Roles this staff member can be assigned. Roles are guard-scoped, so a
     * superadmin staff (web guard) and an agency staff (agency guard) only
     * ever see roles created for their own guard.
     */
    /**
     * Roles this staff member can be assigned: the same roles RoleService
     * lists on /admin/roles for the current session (an agency sees only
     * roles it created, a superadmin sees only its own).
     */
    public function availableRoles(User|AgencyUser $staff): \Illuminate\Support\Collection
    {
        return $this->roleService->searchRoles('', 1000)->getCollection();
    }

    /**
     * Assign a role to a staff member, replacing any role it already holds.
     */
    public function assignRole(User|AgencyUser $staff, string $roleName): void
    {
        try {
            $staff->syncRoles([$roleName]);
            $this->logActivity($staff, 'role_assigned', "Assigned role \"{$roleName}\"");
        } catch (Exception $e) {
            throw new Exception('Error assigning role: ' . $e->getMessage());
        }
    }

    /**
     * Reset a staff member's password.
     */
    public function resetPassword(User|AgencyUser $staff, string $newPassword): void
    {
        try {
            $staff->update(['password' => bcrypt($newPassword)]);
            $this->logActivity($staff, 'password_reset', 'Password was reset');
        } catch (Exception $e) {
            throw new Exception('Error resetting password: ' . $e->getMessage());
        }
    }

    /**
     * Upload a file and return its public path
     */
    public function uploadFile(UploadedFile $file, string $folder): string
    {
        try {
            return '/storage/' . $file->store($folder, 'public');
        } catch (Exception $e) {
            throw new Exception('Error uploading file: ' . $e->getMessage());
        }
    }

    public function uploadPhoto(UploadedFile $photo): string
    {
        return $this->uploadFile($photo, 'profile-pictures');
    }

    /**
     * Create a staff member with all related records. Lands in agency_users
     * for an agency session, users for a superadmin session.
     */
    public function createStaff(array $data): User|AgencyUser
    {
        try {
            $agency = $this->currentAgency();

            if ($agency) {
                $staff = AgencyUser::create([
                    'agency_id' => $agency->id,
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'] ?? null,
                    'password' => $data['password'],
                    'profile_pic' => $data['profile_pic'] ?? null,
                    'is_owner' => false,
                    'status' => 'active',
                ]);
            } else {
                $staff = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'] ?? null,
                    'password' => $data['password'],
                    'profile_pic' => $data['profile_pic'] ?? null,
                    'type' => 'staff',
                ]);
            }

            $this->syncProfile($staff, $data);
            $this->syncPassport($staff, $data);
            $this->syncEmergencyContact($staff, $data);
            $this->syncPayment($staff, $data);
            $this->syncEducations($staff, $data['educations'] ?? []);
            $this->syncTaxDeductions($staff, $data['tax_deductions'] ?? []);
            $this->storeDocuments($staff, $data['documents'] ?? []);

            $this->logActivity($staff, 'created', 'Staff member created');

            return $staff;
        } catch (Exception $e) {
            throw new Exception('Error creating staff: ' . $e->getMessage());
        }
    }

    /**
     * Update a staff member with all related records
     */
    public function updateStaff(User|AgencyUser $staff, array $data): User|AgencyUser
    {
        try {
            $staffData = [
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
            ];

            if (!empty($data['password'])) {
                $staffData['password'] = $data['password'];
            }

            if (!empty($data['profile_pic'])) {
                $staffData['profile_pic'] = $data['profile_pic'];
            }

            $staff->update($staffData);

            $this->syncProfile($staff, $data);
            $this->syncPassport($staff, $data);
            $this->syncEmergencyContact($staff, $data);
            $this->syncPayment($staff, $data);
            $this->syncEducations($staff, $data['educations'] ?? []);
            $this->syncTaxDeductions($staff, $data['tax_deductions'] ?? []);
            $this->storeDocuments($staff, $data['documents'] ?? []);

            $this->logActivity($staff, 'updated', 'Staff details updated');

            return $staff->fresh(self::RELATIONS);
        } catch (Exception $e) {
            throw new Exception('Error updating staff: ' . $e->getMessage());
        }
    }

    /**
     * Create or update the staff profile record
     */
    public function syncProfile(User|AgencyUser $staff, array $data): void
    {
        StaffProfile::updateOrCreate(
            $this->staffableAttributes($staff),
            $this->ownerAttributes() + [
                'dob' => $data['dob'] ?? null,
                'joining_date' => $data['joining_date'] ?? null,
                'country' => $data['country'] ?? null,
                'zip_code_id' => $data['zip_code_id'] ?? null,
                'address_id' => $data['address_id'] ?? null,
                'street_id' => $data['street_id'] ?? null,
                'county' => $data['county'] ?? null,
                'city' => $data['city'] ?? null,
                'address' => $data['address'] ?? null,
                'skills' => $data['skills'] ?? [],
            ]
        );
    }

    /**
     * Create or update the passport / visa record.
     * Visa fields are only kept when the staff member is a foreigner.
     */
    public function syncPassport(User|AgencyUser $staff, array $data): void
    {
        $isForeigner = (bool) ($data['is_foreigner'] ?? false);

        StaffPassport::updateOrCreate(
            $this->staffableAttributes($staff),
            $this->ownerAttributes() + [
                'passport_number' => $data['passport_number'] ?? null,
                'place_of_issue' => $data['place_of_issue'] ?? null,
                'date_of_issue' => $data['date_of_issue'] ?? null,
                'expiry_date' => $data['expiry_date'] ?? null,
                'front_image' => $data['front_image'] ?? null,
                'back_image' => $data['back_image'] ?? null,
                'is_foreigner' => $isForeigner,
                'visa_type' => $isForeigner ? ($data['visa_type'] ?? null) : null,
                'visa_number' => $isForeigner ? ($data['visa_number'] ?? null) : null,
                'visa_expiry_date' => $isForeigner ? ($data['visa_expiry_date'] ?? null) : null,
            ]
        );
    }

    /**
     * Create or update the emergency contact record
     */
    public function syncEmergencyContact(User|AgencyUser $staff, array $data): void
    {
        StaffEmergencyContact::updateOrCreate(
            $this->staffableAttributes($staff),
            $this->ownerAttributes() + [
                'contact_name' => $data['emergency_contact_name'] ?? null,
                'relationship' => $data['emergency_relationship'] ?? null,
                'phone' => $data['emergency_phone'] ?? null,
                'alternate_phone' => $data['emergency_alternate_phone'] ?? null,
                'address' => $data['emergency_address'] ?? null,
            ]
        );
    }

    /**
     * Create or update the staff payment record
     */
    public function syncPayment(User|AgencyUser $staff, array $data): void
    {
        StaffPayment::updateOrCreate(
            $this->staffableAttributes($staff),
            $this->ownerAttributes() + [
                'salary' => $data['salary'] ?? null,
                'salary_type' => $data['salary_type'] ?? 'per_month',
                'currency' => $data['currency'] ?? null,
                'bank_name' => $data['bank_name'] ?? null,
                'account_number' => $data['account_number'] ?? null,
                'ifsc_code' => $data['ifsc_code'] ?? null,
            ]
        );
    }

    /**
     * Replace the staff education rows
     */
    public function syncEducations(User|AgencyUser $staff, array $educations): void
    {
        if (empty($educations)) {
            return;
        }

        foreach ($educations as $education) {
            if (empty($education['name'])) {
                continue;
            }

            StaffEducation::create(
                $this->staffableAttributes($staff) + $this->ownerAttributes() + [
                    'name' => $education['name'],
                    'photo' => isset($education['photo']) && $education['photo'] instanceof UploadedFile
                        ? $this->uploadFile($education['photo'], 'staff-educations')
                        : null,
                ]
            );
        }
    }

    /**
     * Replace the staff tax / deduction rows
     */
    public function syncTaxDeductions(User|AgencyUser $staff, array $items): void
    {
        if (empty($items)) {
            return;
        }

        foreach ($items as $item) {
            if (empty($item['name'])) {
                continue;
            }

            StaffTaxDeduction::create(
                $this->staffableAttributes($staff) + $this->ownerAttributes() + [
                    'name' => $item['name'],
                    'value' => $item['value'] ?? 0,
                    'type' => $item['type'] ?? 'tax',
                ]
            );
        }
    }

    /**
     * Store uploaded staff documents
     */
    public function storeDocuments(User|AgencyUser $staff, array $documents): void
    {
        if (empty($documents)) {
            return;
        }

        foreach ($documents as $document) {
            if (empty($document['file']) || !$document['file'] instanceof UploadedFile) {
                continue;
            }

            $file = $document['file'];

            StaffDocument::create(
                $this->staffableAttributes($staff) + $this->ownerAttributes() + [
                    'document_name' => $document['document_name'] ?? '',
                    'document_type' => $document['document_type'] ?? null,
                    'file_path' => $this->uploadFile($file, 'staff-documents'),
                    'file_type' => $file->getClientOriginalExtension(),
                ]
            );
        }
    }

    public function deleteStaff(User|AgencyUser $staff): bool
    {
        try {
            // A polymorphic column cannot carry a foreign key, so deleting
            // the staff member does not cascade to the related staff_*
            // tables the way the old user_id FK did. Clean them up explicitly.
            $attributes = $this->staffableAttributes($staff);

            StaffProfile::where($attributes)->delete();
            StaffPayment::where($attributes)->delete();
            StaffPassport::where($attributes)->delete();
            StaffEducation::where($attributes)->delete();
            StaffTaxDeduction::where($attributes)->delete();
            StaffDocument::where($attributes)->delete();

            return $staff->delete();
        } catch (Exception $e) {
            throw new Exception('Error deleting staff: ' . $e->getMessage());
        }
    }

    public function toggleStatus(User|AgencyUser $staff): User|AgencyUser
    {
        try {
            $newStatus = $staff->status === 'active' ? 'inactive' : 'active';
            $staff->update(['status' => $newStatus]);
            $this->logActivity($staff, 'status_changed', "Status changed to \"{$newStatus}\"");

            return $staff->fresh();
        } catch (Exception $e) {
            throw new Exception('Error toggling staff status: ' . $e->getMessage());
        }
    }

    public function deleteEducation(int $id): bool
    {
        return (bool) StaffEducation::findOrFail($id)->delete();
    }

    public function deleteTaxDeduction(int $id): bool
    {
        return (bool) StaffTaxDeduction::findOrFail($id)->delete();
    }

    public function deleteDocument(int $id): bool
    {
        return (bool) StaffDocument::findOrFail($id)->delete();
    }

    /**
     * Validation rules per wizard step
     */
    public function validateStep(int $step, array $data, User|AgencyUser|null $existingStaff = null): array
    {
        // Agency staff live in agency_users, superadmin staff in users.
        $emailTable = $this->currentAgency() ? 'agency_users' : 'users';
        $emailRule = 'required|email|unique:' . $emailTable . ',email' . ($existingStaff ? ',' . $existingStaff->id : '');
        $photoRule = $existingStaff
            ? 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            : 'required|image|mimes:jpeg,png,jpg,gif|max:2048';
        $passwordRule = $existingStaff ? 'nullable|string|min:8' : 'required|string|min:8';

        $profileRules = [
            'name' => 'required|string|max:255',
            'email' => $emailRule,
            'phone' => 'required|string|max:20',
            'profile_pic' => $photoRule,
            'password' => $passwordRule,
            'dob' => 'nullable|date',
            'joining_date' => 'nullable|date',
            'skills' => 'nullable|array',
            'skills.*' => 'nullable|string|max:255',
        ];

        $addressRules = [
            'country' => 'required|string|max:255',
            'zip_code_id' => 'required|string|max:255',
            'address_id' => 'required|string|max:255',
            'street_id' => 'required|string|max:255',
            'county' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
        ];

        $paymentRules = [
            'salary' => 'nullable|numeric|min:0',
            'salary_type' => 'nullable|string|in:per_day,per_hour,per_month',
            'currency' => 'nullable|string|max:10',
            'bank_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:50',
            'ifsc_code' => 'nullable|string|max:20',
        ];

        $educationRules = [
            'educations' => 'nullable|array',
            'educations.*.name' => 'nullable|string|max:255',
            'educations.*.photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];

        $taxRules = [
            'tax_deductions' => 'nullable|array',
            'tax_deductions.*.name' => 'nullable|string|max:255',
            'tax_deductions.*.value' => 'nullable|numeric|min:0',
            'tax_deductions.*.type' => 'nullable|string|in:tax,deduction',
        ];

        $documentRules = [
            'documents' => 'nullable|array',
            'documents.*.document_name' => 'nullable|string|max:255',
            'documents.*.document_type' => 'nullable|string|max:100',
            'documents.*.file' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:5120',
        ];

        $emergencyRules = [
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_relationship' => 'nullable|string|max:100',
            'emergency_phone' => 'nullable|string|max:20',
            'emergency_alternate_phone' => 'nullable|string|max:20',
            'emergency_address' => 'nullable|string|max:500',
        ];

        $passportRules = [
            'passport_number' => 'nullable|string|max:100',
            'place_of_issue' => 'nullable|string|max:255',
            'date_of_issue' => 'nullable|date|before:today',
            'expiry_date' => 'nullable|date|after:today',
            'front_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'back_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_foreigner' => 'nullable|boolean',
            'visa_type' => 'nullable|required_if:is_foreigner,1|string|max:100',
            'visa_number' => 'nullable|required_if:is_foreigner,1|string|max:100',
            'visa_expiry_date' => 'nullable|required_if:is_foreigner,1|date',
        ];

        return match ($step) {
            1 => $profileRules,
            2 => $addressRules,
            3 => $emergencyRules,
            4 => $passportRules,
            5 => $paymentRules,
            6 => $educationRules,
            7 => $taxRules,
            8 => $documentRules,
            default => array_merge($profileRules, $addressRules, $passportRules, $paymentRules, $educationRules, $taxRules, $documentRules, $emergencyRules),
        };
    }
}
