<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Services\PackageService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

/** Package Management (admin), with Inertia: the list, add, edit and delete. */
class PackageController extends Controller
{
    public function __construct(protected PackageService $packages)
    {
    }

    public function index()
    {
        return Inertia::render('Admin/Packages/Index', [
            'packages' => $this->packages->all(),
        ]);
    }

    public function store(Request $request)
    {
        $package = $this->packages->create($this->validated($request), $request->file('image'));

        return back()->with('success', "Package \"{$package->name}\" added.");
    }

    /** Sent as POST with _method=PUT, so the image upload arrives as multipart form data. */
    public function update(Request $request, Package $package)
    {
        $this->packages->update($package, $this->validated($request, $package), $request->file('image'));

        return back()->with('success', "Package \"{$package->name}\" updated.");
    }

    public function destroy(Package $package)
    {
        $this->packages->delete($package);

        return back()->with('success', "Package \"{$package->name}\" deleted.");
    }

    private function validated(Request $request, ?Package $package = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('packages', 'name')->ignore($package?->id)],
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'origin_country' => 'nullable|string|max:255',
            'destination_country' => 'required|string|max:255',
            'hotel_name' => 'nullable|string|max:255',
            'hotel_stars' => 'nullable|integer|min:0|max:5',
            'duration_days' => 'nullable|integer|min:0',
            'travel_export_included' => 'required|boolean',
            'visa_service_included' => 'required|boolean',
            'status' => 'required|boolean',
            'is_featured' => 'required|boolean',
        ], [
            'image.max' => 'The image may not be larger than 2 MB.',
        ]);
    }
}
