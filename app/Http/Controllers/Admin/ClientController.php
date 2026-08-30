<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClientFolder;
use App\Models\Communication;
use App\Services\AttendanceService;
use App\Services\ClientService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClientController extends Controller
{
    protected ClientService $clientService;
    protected AttendanceService $attendanceService;

    public function __construct(ClientService $clientService, AttendanceService $attendanceService)
    {
        $this->clientService = $clientService;
        $this->attendanceService = $attendanceService;
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

            $validated['family_members'] = $request->input('family_members', []);

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
        ]);
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

            $validated['family_members'] = $request->input('family_members', []);

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
                $validated['folder_id'] ?? null
            );

            return back()->with('success', 'Document(s) uploaded successfully');
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
            $this->clientService->createFolder($client, $validated['parent_id'] ?? null, $validated['name']);

            return back()->with('success', 'Folder created successfully');
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
}
