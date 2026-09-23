<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Services\CountryService;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CountryController extends Controller
{
    protected CountryService $countryService;
    protected SettingsService $settingsService;

    public function __construct(CountryService $countryService, SettingsService $settingsService)
    {
        $this->countryService = $countryService;
        $this->settingsService = $settingsService;
    }

    public function index(Request $request)
    {
        $search = (string) ($request->get('search') ?? '');
        $countries = $this->countryService->search($search, 15);

        return Inertia::render('Admin/Country/Index', [
            'countries' => [
                'data' => $countries->items(),
                'current_page' => $countries->currentPage(),
                'last_page' => $countries->lastPage(),
                'per_page' => $countries->perPage(),
                'total' => $countries->total(),
            ],
            'filters' => [
                'search' => $search,
            ],
            // Full unpaginated list, for the Default Country dropdown.
            'allCountries' => $this->countryService->all(),
            'defaultCountryId' => $this->settingsService->getDefaultTaxCountryId(),
        ]);
    }

    public function updateDefaultCountry(Request $request)
    {
        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
        ]);

        $this->settingsService->setDefaultTaxCountryId($validated['country_id']);

        return back()->with('success', 'Default country updated successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'countryCode' => 'required|string|max:10|unique:countries,countryCode',
            'countryName' => 'required|string|max:255',
            'currency_code' => 'nullable|string|max:10',
            'exchange_rate' => 'nullable|numeric|min:0',
        ]);

        $this->countryService->create($validated);

        return back()->with('success', 'Country created successfully');
    }

    public function update(Request $request, Country $country)
    {
        $validated = $request->validate([
            'countryCode' => 'required|string|max:10|unique:countries,countryCode,' . $country->id,
            'countryName' => 'required|string|max:255',
            'currency_code' => 'nullable|string|max:10',
            'exchange_rate' => 'nullable|numeric|min:0',
        ]);

        $this->countryService->update($country, $validated);

        return back()->with('success', 'Country updated successfully');
    }

    public function destroy(Country $country)
    {
        $this->countryService->delete($country);

        return back()->with('success', 'Country deleted successfully');
    }
}
