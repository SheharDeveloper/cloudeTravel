<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Services\CountryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CountryController extends Controller
{
    protected CountryService $countryService;

    public function __construct(CountryService $countryService)
    {
        $this->countryService = $countryService;
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
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'countryCode' => 'required|string|max:10|unique:countries,countryCode',
            'countryName' => 'required|string|max:255',
        ]);

        $this->countryService->create($validated);

        return back()->with('success', 'Country created successfully');
    }

    public function update(Request $request, Country $country)
    {
        $validated = $request->validate([
            'countryCode' => 'required|string|max:10|unique:countries,countryCode,' . $country->id,
            'countryName' => 'required|string|max:255',
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
