<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\AgencyUser;
use App\Models\StaffDocument;
use App\Models\StaffEducation;
use App\Models\User;
use App\Services\AddressService;
use App\Services\AttendanceService;
use App\Services\StaffService;
use App\Services\TaskService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    protected TaskService $taskService;
    protected AttendanceService $attendanceService;
    protected StaffService $staffService;

    public function __construct(TaskService $taskService, AttendanceService $attendanceService, StaffService $staffService)
    {
        $this->taskService = $taskService;
        $this->attendanceService = $attendanceService;
        $this->staffService = $staffService;
    }

    /**
     * Whoever is signed in on either guard right now.
     */
    private function currentPrincipal(): User|AgencyUser
    {
        return Auth::guard('agency')->user() ?? Auth::guard('web')->user();
    }

    /**
     * A "staff-type" account (as opposed to a superadmin or an agency
     * owner) is the only one that gets the self-service details editor —
     * others have no passport/address/education records to speak of.
     */
    private function isStaffType(User|AgencyUser $principal): bool
    {
        return $principal instanceof AgencyUser
            ? !$principal->is_owner
            : $principal->type !== 'super_admin';
    }

    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * The "overview" style profile page — avatar/name header with real
     * account stats, plus that account's documents and activity log.
     * Works for either guard: an admin-side User or an agency-side
     * AgencyUser, whichever is currently signed in.
     */
    public function overview(Request $request): Response
    {
        $principal = $this->currentPrincipal();

        $roleName = $principal->roles->first()?->name;
        if (!$roleName) {
            $roleName = $principal instanceof AgencyUser
                ? ($principal->is_owner ? 'Agency Owner' : 'Agency Staff')
                : ucwords(str_replace('_', ' ', $principal->type ?? 'user'));
        }

        $documents = $principal->staffDocuments()->latest()->get()->map(fn ($doc) => [
            'id' => $doc->id,
            'document_name' => $doc->document_name,
            'document_type' => $doc->document_type,
            'file_path' => $doc->file_path,
            'created_at' => $doc->created_at->format('M d, Y'),
        ])->values();

        $activityLogs = $principal->staffActivityLogs()->latest()->limit(20)->get()->map(fn ($log) => [
            'id' => $log->id,
            'action' => $log->action,
            'description' => $log->description,
            'created_at' => $log->created_at->format('M d, Y h:i A'),
        ])->values();

        $attendanceMonth = $request->get('attendance_month') ?: now()->format('Y-m');

        $passport = $principal->staffPassport;
        $payment = $principal->staffPayment;

        return Inertia::render('ProfileOverview', [
            'profile' => [
                'name' => $principal->name,
                'email' => $principal->email,
                'phone' => $principal->phone,
                'profile_image_url' => $principal->profile_image_url,
                'role' => $roleName,
                'status' => $principal->status,
                'joined_at' => $principal->created_at->format('M d, Y'),
                'email_verified' => (bool) $principal->email_verified_at,
                'agency_name' => $principal instanceof AgencyUser ? $principal->agency?->name : null,
            ],
            'canEditDetails' => $this->isStaffType($principal),
            'passport' => $passport ? [
                'passport_number' => $passport->passport_number,
                'front_image' => $passport->front_image,
                'back_image' => $passport->back_image,
                'expiry_date' => $passport->expiry_date?->format('Y-m-d'),
                'is_foreigner' => $passport->is_foreigner,
                'visa_expiry_date' => $passport->visa_expiry_date?->format('Y-m-d'),
            ] : null,
            'payment' => $payment ? [
                'salary' => $payment->salary,
                'bank_name' => $payment->bank_name,
                'account_number' => $payment->account_number,
                'ifsc_code' => $payment->ifsc_code,
            ] : null,
            'hasEmergencyContact' => (bool) $principal->staffEmergencyContact,
            'documents' => $documents,
            'activityLogs' => $activityLogs,
            'tasks' => $this->taskService->tasksAssignedTo($principal),
            'attendanceMonth' => $attendanceMonth,
            'attendanceHistory' => $this->attendanceService->monthlyHistory($principal, $attendanceMonth)->values(),
            'leaveHistory' => $this->attendanceService->leaveHistoryFor($principal),
            'leaveBalances' => $this->attendanceService->leaveBalancesFor($principal),
        ]);
    }

    /**
     * Self-service editor for a staff member's own Address, Emergency
     * Contact, Passport & Visa, Education, and Documents — the same data
     * an admin edits from /admin/staff/{uid}/edit, but scoped to just
     * these sections and to the signed-in account's own records. Only
     * shown to staff-type accounts (see isStaffType()).
     */
    public function editDetails(Request $request): Response
    {
        $principal = $this->currentPrincipal();
        $addressService = new AddressService();

        return Inertia::render('ProfileEditDetails', [
            'staff' => $this->staffService->getStaffById($principal),
            'zipCodes' => $addressService->getZipCodesForDropdown(),
            'addressData' => $addressService->getAllAddressData(),
        ]);
    }

    /**
     * Persist the self-service details form. Deliberately bypasses
     * StaffService::updateStaff()/validateStep() — those assume the full
     * admin wizard (name/email/password/salary/etc. all required) — and
     * instead calls the individual sync*() methods directly with fields
     * that are all optional, since this is a partial, self-service edit.
     */
    public function updateDetails(Request $request): RedirectResponse
    {
        $principal = $this->currentPrincipal();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'profile_pic' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',

            'country' => 'nullable|string|max:255',
            'zip_code_id' => 'nullable|string|max:255',
            'address_id' => 'nullable|string|max:255',
            'street_id' => 'nullable|string|max:255',
            'county' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',

            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_relationship' => 'nullable|string|max:100',
            'emergency_phone' => 'nullable|string|max:20',
            'emergency_alternate_phone' => 'nullable|string|max:20',
            'emergency_address' => 'nullable|string|max:500',

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

            'educations' => 'nullable|array',
            'educations.*.name' => 'nullable|string|max:255',
            'educations.*.photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',

            'documents' => 'nullable|array',
            'documents.*.document_name' => 'nullable|string|max:255',
            'documents.*.document_type' => 'nullable|string|max:100',
            'documents.*.file' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:5120',
        ]);

        $principal->name = $validated['name'];
        $principal->phone = $validated['phone'] ?? null;

        if ($request->hasFile('profile_pic')) {
            $principal->profile_pic = $this->staffService->uploadPhoto($request->file('profile_pic'));
        }

        $principal->save();

        $existingPassport = $principal->staffPassport;

        if ($request->hasFile('front_image')) {
            $validated['front_image'] = $this->staffService->uploadFile($request->file('front_image'), 'staff-passports');
        } else {
            $validated['front_image'] = $existingPassport?->front_image;
        }

        if ($request->hasFile('back_image')) {
            $validated['back_image'] = $this->staffService->uploadFile($request->file('back_image'), 'staff-passports');
        } else {
            $validated['back_image'] = $existingPassport?->back_image;
        }

        $validated['educations'] = $this->collectEducations($request);
        $validated['documents'] = $this->collectDocuments($request);

        $this->staffService->syncProfile($principal, $validated);
        $this->staffService->syncPassport($principal, $validated);
        $this->staffService->syncEmergencyContact($principal, $validated);
        $this->staffService->syncEducations($principal, $validated['educations']);
        $this->staffService->storeDocuments($principal, $validated['documents']);

        return to_route('profile.overview')->with('success', 'Profile updated successfully');
    }

    /**
     * Delete one of the signed-in account's own education rows.
     */
    public function deleteEducation(int $id): RedirectResponse
    {
        $principal = $this->currentPrincipal();
        $education = StaffEducation::findOrFail($id);

        abort_if(
            $education->staffable_type !== get_class($principal) || $education->staffable_id !== $principal->id,
            403
        );

        $education->delete();

        return back()->with('success', 'Education record deleted successfully');
    }

    /**
     * Delete one of the signed-in account's own document rows.
     */
    public function deleteDocument(int $id): RedirectResponse
    {
        $principal = $this->currentPrincipal();
        $document = StaffDocument::findOrFail($id);

        abort_if(
            $document->staffable_type !== get_class($principal) || $document->staffable_id !== $principal->id,
            403
        );

        $document->delete();

        return back()->with('success', 'Document deleted successfully');
    }

    /**
     * Merge uploaded education photos back into the education rows.
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
     * Merge uploaded document files back into the document rows.
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

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Update user profile from the ProfileSettings page (redirects to /profile).
     */
    public function updateFromProfile(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile');
    }

    /**
     * Upload profile picture and update profile information.
     */
    public function uploadProfile(Request $request): RedirectResponse
    {
        $user = $request->user();
        $isSuperAdmin = $user->type === 'super_admin';

        $emailRules = $isSuperAdmin
            ? ['required', 'email', 'max:255', 'unique:users,email,' . $user->id]
            : ['required', 'email', 'max:255'];

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => $emailRules,
            'phone' => ['nullable', 'regex:/^\d{10}$/'],
            'profile_pic' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        if (!$isSuperAdmin && $validated['email'] !== $user->email) {
            return back()->withErrors(['email' => 'You are not authorized to change your email.']);
        }

        $user->name = $validated['name'];
        $user->phone = $validated['phone'] ?? null;

        if ($isSuperAdmin) {
            $user->email = $validated['email'];
            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }
        }

        if ($request->hasFile('profile_pic')) {
            if ($user->profile_pic && Storage::exists('public/' . $user->profile_pic)) {
                Storage::delete('public/' . $user->profile_pic);
            }

            $path = $request->file('profile_pic')->store('profile-pictures', 'public');
            $user->profile_pic = $path;
        }

        $user->save();

        return to_route('profile');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
