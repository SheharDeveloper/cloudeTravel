<?php

namespace App\Http\Controllers;

use App\Http\Requests\Agency\StoreAgencyRequest;
use App\Http\Requests\Agency\UpdateAgencyRequest;
use App\Models\Agency;
use App\Models\User;
use App\Services\AgencyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Throwable;

class AgencyController extends Controller
{
    public function __construct(private AgencyService $agencyService)
    {
    }

    public function store(StoreAgencyRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $user = Auth::user();

            $data['user_id'] = $user->id;

            $this->agencyService->createAgency($data);

            return redirect()
                ->route('agency.index')
                ->with('success', 'Agency created successfully!');
        } catch (Throwable $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to create agency: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function update(UpdateAgencyRequest $request, Agency $agency): RedirectResponse
    {
        try {
            $data = $request->validated();
            $user = Auth::user();

            if ($agency->user_id !== $user->id) {
                return redirect()
                    ->back()
                    ->with('error', 'Unauthorized');
            }

            $this->agencyService->updateAgency($agency->id, $data);

            return redirect()
                ->route('agency.show', $agency->id)
                ->with('success', 'Agency updated successfully!');
        } catch (Throwable $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to update agency: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function destroy(Agency $agency): RedirectResponse
    {
        try {
            $user = Auth::user();

            if ($agency->user_id !== $user->id) {
                return redirect()
                    ->back()
                    ->with('error', 'Unauthorized');
            }

            $this->agencyService->deleteAgency($agency->id);

            return redirect()
                ->route('agency.index')
                ->with('success', 'Agency deleted successfully!');
        } catch (Throwable $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to delete agency: ' . $e->getMessage());
        }
    }
}