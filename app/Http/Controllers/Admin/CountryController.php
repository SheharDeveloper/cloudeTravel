<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Services\CountryService;
use App\Services\ExchangeRateService;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CountryController extends Controller
{
    protected CountryService $countryService;
    protected SettingsService $settingsService;
    protected ExchangeRateService $exchangeRateService;

    public function __construct(CountryService $countryService, SettingsService $settingsService, ExchangeRateService $exchangeRateService)
    {
        $this->countryService = $countryService;
        $this->settingsService = $settingsService;
        $this->exchangeRateService = $exchangeRateService;
    }

    /** The default country, and today's exchange rates against its currency (from the API). */
    public function index()
    {
        $base = $this->exchangeRateService->displayBase();
        try {
            $rates = $this->exchangeRateService->list($base);
            $ratesError = null;
        } catch (\Throwable $e) {
            report($e);
            $rates = [];
            $ratesError = 'The exchange rates could not be fetched right now. Try Refresh Rates later.';
        }

        return Inertia::render('Admin/Country/Index', [
            // Full list, for the Default Country dropdown.
            'allCountries' => $this->countryService->all(),
            'defaultCountryId' => $this->settingsService->getDefaultTaxCountryId(),
            'rateBase' => $base,
            'rates' => $rates,
            'ratesError' => $ratesError,
            // The exact API call the list comes from
            'ratesSource' => $this->exchangeRateService->url($base),
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

    /** "Refresh Rates": fetches today's rates again instead of the cached ones. */
    public function refreshRates()
    {
        $this->exchangeRateService->refresh();

        return back()->with('success', 'Exchange rates updated');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'countryCode' => 'required|string|max:10|unique:countries,countryCode',
            'countryName' => 'required|string|max:255',
            'currency_code' => 'nullable|string|max:10',
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
