<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\AgencyCommission;
use App\Models\AgencyUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

/**
 * The agency's own Settings page: its commission on each service the
 * superadmin assigned to it. Agency owner only — not the superadmin, and
 * not the agency's staff.
 */
class AgencySettingsController extends Controller
{
    public function index()
    {
        $agency = $this->agency();
        $saved = $agency->commissions()->get()->keyBy('service_name');
        $names = collect(config('services.types'))->pluck('name', 'id');

        $commissions = $agency->agencyServices()->where('status', 1)->pluck('service_name')
            ->map(fn ($id) => [
                'service' => $id,
                'name' => $names[$id] ?? Str::headline($id),
                'commission_type' => $saved[$id]->commission_type ?? AgencyCommission::TYPE_PERCENTAGE,
                'commission_value' => $saved[$id]->commission_value ?? 0,
            ])
            ->values();

        return Inertia::render('Admin/AgencySettings/Index', [
            'commissions' => $commissions,
            'currency' => config('currency'),
        ]);
    }

    public function update(Request $request)
    {
        $agency = $this->agency();
        $services = $agency->agencyServices()->where('status', 1)->pluck('service_name')->all();

        $validated = $request->validate([
            'commissions' => 'present|array',
            'commissions.*.service' => ['required', 'string', Rule::in($services)],
            'commissions.*.commission_type' => ['required', Rule::in([AgencyCommission::TYPE_PERCENTAGE, AgencyCommission::TYPE_FIXED])],
            'commissions.*.commission_value' => 'required|numeric|min:0',
        ]);

        foreach ($validated['commissions'] as $index => $row) {
            if ($row['commission_type'] === AgencyCommission::TYPE_PERCENTAGE && $row['commission_value'] > 100) {
                return back()->withErrors(["commissions.{$index}.commission_value" => 'A percentage commission cannot be more than 100%.']);
            }
        }

        foreach ($validated['commissions'] as $row) {
            AgencyCommission::updateOrCreate(
                ['agency_id' => $agency->id, 'service_name' => $row['service']],
                ['commission_type' => $row['commission_type'], 'commission_value' => $row['commission_value']],
            );
        }

        return back()->with('success', 'Commission saved.');
    }

    private function agency(): Agency
    {
        $user = Auth::guard('agency')->user();
        abort_unless($user instanceof AgencyUser && $user->is_owner && $user->agency, 403);

        return $user->agency;
    }
}
