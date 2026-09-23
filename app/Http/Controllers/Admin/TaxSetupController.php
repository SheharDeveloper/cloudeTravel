<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaxSetup;
use App\Services\CountryService;
use App\Services\TaxSetupService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TaxSetupController extends Controller
{
    protected TaxSetupService $taxSetupService;
    protected CountryService $countryService;

    public function __construct(TaxSetupService $taxSetupService, CountryService $countryService)
    {
        $this->taxSetupService = $taxSetupService;
        $this->countryService = $countryService;
    }

    public function index()
    {
        return Inertia::render('Admin/TaxSetup/Index', [
            'taxSetups' => $this->taxSetupService->all(),
            'countries' => $this->countryService->all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
            'tax_name' => [
                'required', 'string', 'max:255',
                Rule::unique('tax_setups')->where('country_id', $request->input('country_id')),
            ],
            'amount' => 'required|numeric|min:0|max:100',
        ], [
            'tax_name.unique' => 'This tax already exists for the selected country.',
        ]);

        $this->taxSetupService->create($validated);

        return back()->with('success', 'Tax setup created successfully');
    }

    public function update(Request $request, TaxSetup $taxSetup)
    {
        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
            'tax_name' => [
                'required', 'string', 'max:255',
                Rule::unique('tax_setups')->where('country_id', $request->input('country_id'))->ignore($taxSetup->id),
            ],
            'amount' => 'required|numeric|min:0|max:100',
        ], [
            'tax_name.unique' => 'This tax already exists for the selected country.',
        ]);

        $this->taxSetupService->update($taxSetup, $validated);

        return back()->with('success', 'Tax setup updated successfully');
    }

    public function destroy(TaxSetup $taxSetup)
    {
        $this->taxSetupService->delete($taxSetup);

        return back()->with('success', 'Tax setup deleted successfully');
    }
}
