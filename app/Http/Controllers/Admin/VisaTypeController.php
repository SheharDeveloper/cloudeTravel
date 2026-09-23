<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VisaType;
use App\Services\VisaTypeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisaTypeController extends Controller
{
    protected VisaTypeService $visaTypeService;
    public function __construct(VisaTypeService $visaTypeService)
    {
        $this->visaTypeService = $visaTypeService;
    }

    /**
     * Renders the Visa Type management page (name + description CRUD).
     */
    public function index()
    {
         
        return Inertia::render('Admin/Visa/Types', [
            'visaTypes' => $this->visaTypeService->all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:visa_types,name',
            'description' => 'nullable|string',
        ]);

        $this->visaTypeService->create($validated);

        return back()->with('success', 'Visa type created successfully');
    }

    public function update(Request $request, VisaType $visaType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:visa_types,name,' . $visaType->id,
            'description' => 'nullable|string',
        ]);

        $this->visaTypeService->update($visaType, $validated);

        return back()->with('success', 'Visa type updated successfully');
    }

    public function destroy(VisaType $visaType)
    {
        $this->visaTypeService->delete($visaType);

        return back()->with('success', 'Visa type deleted successfully');
    }
}
