<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SpecialOffer;
use App\Services\SpecialOfferService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpecialOfferController extends Controller
{
    protected SpecialOfferService $service;

    public function __construct(SpecialOfferService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 15);
        $page = $request->get('page', 1);

        $offers = $this->service->getAllForAdmin($perPage, $page);

        return Inertia::render('Admin/SpecialOffer/Index', [
            'offers' => $offers->items(),
            'current_page' => $offers->currentPage(),
            'last_page' => $offers->lastPage(),
            'total' => $offers->total(),
            'currency' => config('currency'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/SpecialOffer/Create', [
            'currency' => config('currency'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sub_description' => 'nullable|string',
            'duration_days' => 'nullable|integer',
            'duration_nights' => 'nullable|integer',
            'total_price' => 'required|numeric|min:0',
            'is_active' => 'in:0,1',
            'is_featured' => 'in:0,1',
            'flight_name' => 'nullable|string|max:255',
            'hotel_name' => 'nullable|string|max:255',
            'hotel_star_rating' => 'nullable|integer|min:1|max:5',
            'visa_name' => 'nullable|string|max:255',
            'is_visa' => 'in:0,1',
            'transport_name' => 'nullable|string|max:255',
            'transport_type' => 'nullable|string|max:255',
            'is_transport' => 'in:0,1',
            'rating' => 'nullable|numeric|min:0|max:5',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $validated['is_active'] = (bool) $validated['is_active'];
        $validated['is_featured'] = (bool) $validated['is_featured'];
        $validated['is_visa'] = (bool) ($validated['is_visa'] ?? false);
        $validated['is_transport'] = (bool) ($validated['is_transport'] ?? false);

        $offer = $this->service->create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('special-offers', 'public');
                $this->service->addImage($offer, [
                    'image_path' => $path,
                    'alt_text' => $offer->name,
                ]);
            }
        }

        return redirect()->route('admin.special-offer.show', $offer->uid)
            ->with('success', 'Special Offer created successfully');
    }

    public function show(string $uid)
    {
        $offer = $this->service->getByUid($uid);

        if (!$offer) {
            abort(404);
        }

        return Inertia::render('Admin/SpecialOffer/Show', [
            'offer' => $offer->toArray(),
            'currency' => config('currency'),
        ]);
    }

    public function edit(string $uid)
    {
        $offer = $this->service->getByUid($uid);

        if (!$offer) {
            abort(404);
        }

        return Inertia::render('Admin/SpecialOffer/Edit', [
            'offer' => $offer->toArray(),
            'currency' => config('currency'),
        ]);
    }

    public function update(Request $request, string $uid)
    {
        $offer = $this->service->getByUid($uid);

        if (!$offer) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sub_description' => 'nullable|string',
            'duration_days' => 'nullable|integer',
            'duration_nights' => 'nullable|integer',
            'total_price' => 'required|numeric|min:0',
            'is_active' => 'in:0,1',
            'is_featured' => 'in:0,1',
            'flight_name' => 'nullable|string|max:255',
            'hotel_name' => 'nullable|string|max:255',
            'hotel_star_rating' => 'nullable|integer|min:1|max:5',
            'visa_name' => 'nullable|string|max:255',
            'is_visa' => 'in:0,1',
            'transport_name' => 'nullable|string|max:255',
            'transport_type' => 'nullable|string|max:255',
            'is_transport' => 'in:0,1',
            'rating' => 'nullable|numeric|min:0|max:5',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $validated['is_active'] = (bool) $validated['is_active'];
        $validated['is_featured'] = (bool) $validated['is_featured'];
        $validated['is_visa'] = (bool) ($validated['is_visa'] ?? false);
        $validated['is_transport'] = (bool) ($validated['is_transport'] ?? false);

        $this->service->update($offer, $validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('special-offers', 'public');
                $this->service->addImage($offer, [
                    'image_path' => $path,
                    'alt_text' => $offer->name,
                ]);
            }
        }

        return back()->with('success', 'Special Offer updated successfully');
    }

    public function deleteImage(string $uid, int $imageId)
    {
        $offer = $this->service->getByUid($uid);

        if (!$offer) {
            abort(404);
        }

        $this->service->removeImage($imageId);

        return back()->with('success', 'Image deleted successfully');
    }

    public function destroy(string $uid)
    {
        $offer = $this->service->getByUid($uid);

        if (!$offer) {
            abort(404);
        }

        $this->service->delete($offer);

        return redirect()->route('admin.special-offer.index')
            ->with('success', 'Special Offer deleted successfully');
    }
}
