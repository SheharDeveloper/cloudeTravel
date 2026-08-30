<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\AgencyUser;
use App\Models\Client;
use App\Models\ClientAddress;
use App\Models\ClientDocument;
use App\Models\ClientFamilyMember;
use App\Models\ClientFolder;
use App\Models\ClientPassport;
use App\Models\Communication;
use App\Models\User;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ClientService
{
    private const RELATIONS = ['address', 'passport', 'familyMembers', 'documents', 'folders', 'communications.causer'];

    /**
     * The agency owning the current session, or null for a superadmin.
     */
    public function currentAgency(): ?Agency
    {
        return Auth::guard('agency')->user()?->agency;
    }

    /**
     * Owner attributes stamped onto every client: the signed-in agency, or
     * the superadmin user.
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
     * Search clients belonging to the current session: an agency sees only
     * its own clients, a superadmin sees only its own.
     */
    public function searchClients(string $search = '', int $perPage = 15)
    {
        $query = Client::where($this->ownerAttributes());

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
     * Resolve a client by uid for the current session's owner.
     */
    public function findByUid(string $uid): Client
    {
        return Client::where($this->ownerAttributes())->where('uid', $uid)->firstOrFail();
    }

    public function getClientById(Client $client): Client
    {
        $client->load(self::RELATIONS);

        return $client;
    }

    public function uploadFile(UploadedFile $file, string $folder): string
    {
        try {
            return '/storage/' . $file->store($folder, 'public');
        } catch (Exception $e) {
            throw new Exception('Error uploading file: ' . $e->getMessage());
        }
    }

    /**
     * The storage folder dedicated to this client: every document uploaded
     * for them, regardless of type, is saved under this one folder.
     */
    public function clientFolderPath(Client $client): string
    {
        return 'clients/' . $client->folderName();
    }

    /**
     * Create the client's dedicated storage folder if it doesn't exist yet.
     */
    public function ensureClientFolder(Client $client): void
    {
        Storage::disk('public')->makeDirectory($this->clientFolderPath($client));
    }

    /**
     * Create a client with all related records.
     */
    public function createClient(array $data): Client
    {
        try {
            $client = Client::create(
                $this->ownerAttributes() + [
                    'name' => $data['name'],
                    'email' => $data['email'] ?? null,
                    'phone' => $data['phone'] ?? null,
                    'nationality' => $data['nationality'] ?? null,
                    'gender' => $data['gender'] ?? null,
                    'dob' => $data['dob'] ?? null,
                    'notes' => $data['notes'] ?? null,
                    'status' => 'active',
                ]
            );

            $this->ensureClientFolder($client);

            $this->syncAddress($client, $data);
            $this->syncPassport($client, $data);
            $this->syncFamilyMembers($client, $data['family_members'] ?? []);

            return $client;
        } catch (Exception $e) {
            throw new Exception('Error creating client: ' . $e->getMessage());
        }
    }

    /**
     * Update a client with all related records.
     */
    public function updateClient(Client $client, array $data): Client
    {
        try {
            $client->update([
                'name' => $data['name'],
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'nationality' => $data['nationality'] ?? null,
                'gender' => $data['gender'] ?? null,
                'dob' => $data['dob'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $this->syncAddress($client, $data);
            $this->syncPassport($client, $data);
            $this->syncFamilyMembers($client, $data['family_members'] ?? []);

            return $client->fresh(self::RELATIONS);
        } catch (Exception $e) {
            throw new Exception('Error updating client: ' . $e->getMessage());
        }
    }

    public function syncAddress(Client $client, array $data): void
    {
        ClientAddress::updateOrCreate(
            ['client_id' => $client->id],
            [
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'state' => $data['state'] ?? null,
                'country' => $data['country'] ?? null,
                'zip_code' => $data['zip_code'] ?? null,
            ]
        );
    }

    /**
     * Create or update the passport / visa record. Visa fields are only
     * kept when the client is a foreign national.
     */
    public function syncPassport(Client $client, array $data): void
    {
        $isForeigner = (bool) ($data['is_foreigner'] ?? false);

        ClientPassport::updateOrCreate(
            ['client_id' => $client->id],
            [
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
     * Replace the client's family member rows.
     */
    public function syncFamilyMembers(Client $client, array $familyMembers): void
    {
        $client->familyMembers()->delete();

        foreach ($familyMembers as $member) {
            if (empty($member['name'])) {
                continue;
            }

            ClientFamilyMember::create([
                'client_id' => $client->id,
                'name' => $member['name'],
                'relation' => $member['relation'] ?? null,
                'dob' => $member['dob'] ?? null,
                'passport_number' => $member['passport_number'] ?? null,
                'id_number' => $member['id_number'] ?? null,
            ]);
        }
    }

    /**
     * Upload one or more documents into the client's dedicated folder and
     * record each one. Storage stays flat per client — folder_id only
     * tracks the logical hierarchy shown in the document browser.
     *
     * @param UploadedFile[] $files
     * @return ClientDocument[]
     */
    public function addDocuments(Client $client, array $files, string $documentType, ?int $folderId = null): array
    {
        $this->ensureClientFolder($client);

        if ($folderId) {
            ClientFolder::where('client_id', $client->id)->findOrFail($folderId);
        }

        $created = [];

        foreach ($files as $file) {
            if (!$file instanceof UploadedFile) {
                continue;
            }

            $path = $this->uploadFile($file, $this->clientFolderPath($client));

            $created[] = ClientDocument::create(
                $this->ownerAttributes() + [
                    'documentable_type' => Client::class,
                    'documentable_id' => $client->id,
                    'folder_id' => $folderId,
                    'document_name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                    'document_type' => $documentType,
                    'file_path' => $path,
                    'file_type' => $file->getClientOriginalExtension(),
                ]
            );
        }

        return $created;
    }

    public function deleteDocument(int $id): bool
    {
        $document = ClientDocument::findOrFail($id);

        if ($document->file_path) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $document->file_path));
        }

        return (bool) $document->delete();
    }

    /**
     * Create a folder for the client, optionally nested inside another one.
     */
    public function createFolder(Client $client, ?int $parentId, string $name): ClientFolder
    {
        if ($parentId) {
            ClientFolder::where('client_id', $client->id)->findOrFail($parentId);
        }

        return ClientFolder::create(
            $this->ownerAttributes() + [
                'client_id' => $client->id,
                'parent_id' => $parentId,
                'name' => $name,
            ]
        );
    }

    /**
     * Delete a folder along with every subfolder and document nested inside
     * it. Storage files are removed explicitly first, then the folder row
     * is deleted — the database cascades the rest (subfolders, documents).
     */
    public function deleteFolder(ClientFolder $folder): bool
    {
        $folderIds = $this->collectFolderIds($folder);

        ClientDocument::whereIn('folder_id', $folderIds)->get()->each(function (ClientDocument $document) {
            if ($document->file_path) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $document->file_path));
            }
        });

        return (bool) $folder->delete();
    }

    /**
     * This folder's id plus every descendant folder id, depth-first.
     */
    private function collectFolderIds(ClientFolder $folder): array
    {
        $ids = [$folder->id];

        foreach ($folder->children as $child) {
            $ids = array_merge($ids, $this->collectFolderIds($child));
        }

        return $ids;
    }

    public function deleteClient(Client $client): bool
    {
        try {
            // A polymorphic column cannot carry a foreign key, so deleting the
            // client does not cascade to client_documents on its own.
            $client->documents()->delete();

            Storage::disk('public')->deleteDirectory($this->clientFolderPath($client));

            return $client->delete();
        } catch (Exception $e) {
            throw new Exception('Error deleting client: ' . $e->getMessage());
        }
    }

    public function toggleStatus(Client $client): Client
    {
        try {
            $client->update(['status' => $client->status === 'active' ? 'inactive' : 'active']);

            return $client->fresh();
        } catch (Exception $e) {
            throw new Exception('Error toggling client status: ' . $e->getMessage());
        }
    }

    /**
     * Validation rules for a (possibly multi-file) document upload
     */
    public function documentRules(): array
    {
        return [
            'document_type' => 'required|string|max:100',
            'folder_id' => 'nullable|integer|exists:client_folders,id',
            'files' => 'required|array|min:1',
            'files.*' => 'file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,xls,xlsx,ppt,pptx,csv,txt,mp3,mp4|max:5120',
        ];
    }

    /**
     * Validation rules for creating a folder
     */
    public function folderRules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|integer|exists:client_folders,id',
        ];
    }

    /**
     * Log a communication (call, email, etc.) against the client, stamped
     * with whoever is logged in.
     */
    public function addCommunication(Client $client, User|AgencyUser $causer, string $description): Communication
    {
        return Communication::create([
            'communicable_type' => Client::class,
            'communicable_id' => $client->id,
            'causer_type' => get_class($causer),
            'causer_id' => $causer->id,
            'description' => $description,
        ]);
    }

    /**
     * Edit a communication — only its author or an admin may.
     */
    public function updateCommunication(int $id, User|AgencyUser|null $principal, string $description): Communication
    {
        $communication = Communication::findOrFail($id);

        $this->authorizeCommunicationManage($communication, $principal);

        $communication->update(['description' => $description]);

        return $communication;
    }

    /**
     * Delete a communication — only its author or an admin may.
     */
    public function deleteCommunication(int $id, User|AgencyUser|null $principal): bool
    {
        $communication = Communication::findOrFail($id);

        $this->authorizeCommunicationManage($communication, $principal);

        return (bool) $communication->delete();
    }

    /**
     * A communication may be managed (edited/deleted) by whoever wrote it,
     * or by an admin (an agency owner or the superadmin) — never by another
     * staff member.
     */
    public function canManageCommunication(Communication $communication, User|AgencyUser|null $principal): bool
    {
        if (!$principal) {
            return false;
        }

        $isAuthor = $communication->causer_type === get_class($principal) && $communication->causer_id === $principal->id;
        $isAdmin = $principal instanceof AgencyUser ? $principal->is_owner : $principal->type !== 'staff';

        return $isAuthor || $isAdmin;
    }

    private function authorizeCommunicationManage(Communication $communication, User|AgencyUser|null $principal): void
    {
        if (!$this->canManageCommunication($communication, $principal)) {
            throw new AuthorizationException('You are not allowed to manage this communication.');
        }
    }

    /**
     * Validation rules for logging a communication
     */
    public function communicationRules(): array
    {
        return [
            'description' => 'required|string|max:2000',
        ];
    }

    /**
     * Validation rules per wizard step
     */
    public function validateStep(int $step, array $data): array
    {
        $basicRules = [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'nationality' => 'nullable|string|max:100',
            'gender' => 'nullable|string|in:male,female,other',
            'dob' => 'nullable|date',
            'notes' => 'nullable|string|max:2000',
        ];

        $addressRules = [
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:20',
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

        $familyRules = [
            'family_members' => 'nullable|array',
            'family_members.*.name' => 'nullable|string|max:255',
            'family_members.*.relation' => 'nullable|string|max:100',
            'family_members.*.dob' => 'nullable|date',
            'family_members.*.passport_number' => 'nullable|string|max:100',
            'family_members.*.id_number' => 'nullable|string|max:100',
        ];

        return match ($step) {
            1 => $basicRules,
            2 => $addressRules,
            3 => $passportRules,
            4 => $familyRules,
            default => array_merge($basicRules, $addressRules, $passportRules, $familyRules),
        };
    }
}
