<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClientFolder;
use App\Models\Communication;
use App\Services\AttendanceService;
use App\Services\ClientPortalService;
use App\Services\ClientService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClientController extends Controller
{
    protected ClientService $clientService;
    protected AttendanceService $attendanceService;
    protected ClientPortalService $portal;

    public function __construct(ClientService $clientService, AttendanceService $attendanceService, ClientPortalService $portal)
    {
        $this->clientService = $clientService;
        $this->attendanceService = $attendanceService;
        $this->portal = $portal;
    }

    /**
     * Display a listing of clients
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search = (string) ($request->get('search') ?? '');

        $clients = $this->clientService->searchClients($search, $perPage);

        return Inertia::render('Admin/Client/Index', [
            'clients' => [
                'data' => $clients->items(),
                'current_page' => $clients->currentPage(),
                'last_page' => $clients->lastPage(),
                'per_page' => $clients->perPage(),
            ],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new client
     */
    public function create()
    {
        return Inertia::render('Admin/Client/Create');
    }

    /**
     * Store a newly created client in storage
     */
    public function store(Request $request)
    {
        $rules = $this->clientService->validateStep(0, $request->all());
        $validated = $request->validate($rules);

        return DB::transaction(function () use ($request, $validated) {
            foreach (['front_image', 'back_image'] as $img) {
                if ($request->hasFile($img)) {
                    $validated[$img] = $this->clientService->uploadFile($request->file($img), 'client-passports');
                }
            }

            $validated['family_members'] = $this->collectFamilyMembers($request);

            $this->clientService->createClient($validated);

            return redirect()->route('admin.client.index')
                ->with('success', 'Client created successfully');
        });
    }

    /**
     * Display the specified client
     */
    public function show($uid)
    {
        $client = $this->clientService->findByUid($uid);
        $client = $this->clientService->getClientById($client);

        $principal = $this->attendanceService->currentPrincipal();
        $client->communications->each(function (Communication $communication) use ($principal) {
            $communication->can_manage = $this->clientService->canManageCommunication($communication, $principal);
        });

        return Inertia::render('Admin/Client/Show', [
            'client' => $client,
            // Client Login: whether the client can sign in, and where
            'clientLogin' => $this->portal->loginInfo($client),
        ]);
    }

    /** Client Login: set or change the password the client signs in with. */
    public function updateLogin(Request $request, $uid)
    {
        $client = $this->clientService->findByUid($uid);
        if (! $client->email) {
            throw \Illuminate\Validation\ValidationException::withMessages(['password' => 'Add an email address to the client first: they sign in with it.']);
        }
        $validated = $request->validate([
            'password' => 'required|string|min:8|max:100|confirmed',
        ]);

        $this->portal->setPassword($client, $validated['password']);

        return back()->with('success', 'Client login saved. The client can now sign in with their email and this password.');
    }

    /** Client Login: back to the default password, the client's email. */
    public function resetLogin($uid)
    {
        $client = $this->clientService->findByUid($uid);
        if (! $client->email) {
            throw \Illuminate\Validation\ValidationException::withMessages(['password' => 'Add an email address to the client first: they sign in with it.']);
        }
        $this->portal->resetToDefault($client);

        return back()->with('success', 'Password reset: the client signs in with their email address as the password.');
    }

    /** Client Login: remove the password, so the client can no longer sign in. */
    public function removeLogin($uid)
    {
        $this->portal->setPassword($this->clientService->findByUid($uid), null);

        return back()->with('success', 'Client login turned off.');
    }

    /**
     * Show the form for editing the specified client
     */
    public function edit($uid)
    {
        $client = $this->clientService->findByUid($uid);

        return Inertia::render('Admin/Client/Edit', [
            'client' => $this->clientService->getClientById($client),
        ]);
    }

    /**
     * Update the specified client in storage
     */
    public function update(Request $request, $uid)
    {
        $client = $this->clientService->findByUid($uid);
        $rules = $this->clientService->validateStep(0, $request->all());
        $validated = $request->validate($rules);

        return DB::transaction(function () use ($request, $validated, $client) {
            foreach (['front_image', 'back_image'] as $img) {
                if ($request->hasFile($img)) {
                    $validated[$img] = $this->clientService->uploadFile($request->file($img), 'client-passports');
                }
            }

            $validated['family_members'] = $this->collectFamilyMembers($request);

            $this->clientService->updateClient($client, $validated);

            return redirect()->route('admin.client.index')
                ->with('success', 'Client updated successfully');
        });
    }

    /**
     * Remove the specified client from storage
     */
    public function destroy($uid)
    {
        try {
            $client = $this->clientService->findByUid($uid);
            $this->clientService->deleteClient($client);

            return redirect()->route('admin.client.index')
                ->with('success', 'Client deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Upload one or more documents into the client's dedicated folder
     */
    public function storeDocument(Request $request, $uid)
    {
        $client = $this->clientService->findByUid($uid);

        $validated = $request->validate($this->clientService->documentRules());

        try {
            $this->clientService->addDocuments(
                $client,
                $request->file('files', []),
                $validated['document_type'],
                $validated['folder_id'] ?? null,
                $validated['delete_date']
            );

            return back()->with('success', 'Document(s) uploaded successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete every document for this client whose delete date has arrived.
     */
    public function destroyDueDocuments($uid)
    {
        try {
            $client = $this->clientService->findByUid($uid);
            $count = $this->clientService->deleteDueDocuments($client);

            return back()->with('success', "{$count} due file(s) deleted successfully");
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Global navbar action: delete every due folder and due document across
     * all of the current session's clients at once — not scoped to a
     * single client's uid.
     */
    public function destroyDueItems()
    {
        try {
            $result = $this->clientService->deleteDueItemsForSession();

            return back()->with('success', "{$result['folders']} due folder(s) and {$result['files']} due file(s) deleted successfully");
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete a single client document
     */
    public function destroyDocument($id)
    {
        try {
            $this->clientService->deleteDocument($id);

            return back()->with('success', 'Document deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Create a folder for the client, optionally nested inside another one
     */
    public function storeFolder(Request $request, $uid)
    {
        $client = $this->clientService->findByUid($uid);

        $validated = $request->validate($this->clientService->folderRules());

        try {
            $this->clientService->createFolder(
                $client,
                $validated['parent_id'] ?? null,
                $validated['name'],
                $validated['delete_date']
            );

            return back()->with('success', 'Folder created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete every folder for this client whose delete date has arrived.
     */
    public function destroyDueFolders($uid)
    {
        try {
            $client = $this->clientService->findByUid($uid);
            $count = $this->clientService->deleteDueFolders($client);

            return back()->with('success', "{$count} due folder(s) deleted successfully");
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete a folder along with everything nested inside it
     */
    public function destroyFolder($id)
    {
        try {
            $folder = ClientFolder::findOrFail($id);
            $this->clientService->deleteFolder($folder);

            return back()->with('success', 'Folder deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Log a communication (call, email, etc.) against the client, stamped
     * with whoever is currently logged in
     */
    public function storeCommunication(Request $request, $uid)
    {
        $client = $this->clientService->findByUid($uid);
        $validated = $request->validate($this->clientService->communicationRules());
        $causer = $this->attendanceService->currentPrincipal();

        try {
            $this->clientService->addCommunication($client, $causer, $validated['description']);

            return back()->with('success', 'Communication logged successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Edit a logged communication — only its author or an admin may
     */
    public function updateCommunication(Request $request, $id)
    {
        $validated = $request->validate($this->clientService->communicationRules());
        $principal = $this->attendanceService->currentPrincipal();

        $this->clientService->updateCommunication($id, $principal, $validated['description']);

        return back()->with('success', 'Communication updated successfully');
    }

    /**
     * Delete a single logged communication — only its author or an admin may
     */
    public function destroyCommunication($id)
    {
        $principal = $this->attendanceService->currentPrincipal();

        $this->clientService->deleteCommunication($id, $principal);

        return back()->with('success', 'Communication deleted successfully');
    }

    /**
     * Toggle client status
     */
    public function toggleStatus($uid)
    {
        try {
            $client = $this->clientService->findByUid($uid);
            $this->clientService->toggleStatus($client);

            return back()->with('success', 'Client status updated successfully');
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

        $rules = $this->clientService->validateStep($step, $request->all());

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
     * Merge uploaded family member passport photos back into each row. On
     * edit, a row with no newly uploaded file falls back to whatever path
     * the frontend sent as existing_front_image/existing_back_image (the
     * image already on record), so re-saving a row without picking a new
     * photo doesn't wipe out the one it already has.
     */
    private function collectFamilyMembers(Request $request): array
    {
        $members = [];

        foreach ($request->input('family_members', []) as $index => $member) {
            $frontFile = $request->file("family_members.{$index}.front_image");
            $backFile = $request->file("family_members.{$index}.back_image");

            $members[$index] = $member;
            $members[$index]['front_image'] = $frontFile
                ? $this->clientService->uploadFile($frontFile, 'client-family-passports')
                : ($member['existing_front_image'] ?? null);
            $members[$index]['back_image'] = $backFile
                ? $this->clientService->uploadFile($backFile, 'client-family-passports')
                : ($member['existing_back_image'] ?? null);
        }

        return $members;
    }
}
