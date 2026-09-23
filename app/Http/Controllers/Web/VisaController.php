<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Visa;
use App\Services\VisaRequirementsService;
use App\Services\VisaService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisaController extends Controller
{
    public function __construct(
        protected VisaService $visaService,
        protected VisaRequirementsService $requirementsService,
    ) {
    }

    /**
     * Travel Visa Requirements: pick where you are travelling from and to,
     * then see the visas offered for that route.
     */
    public function requirements(Request $request)
    {
        return Inertia::render('visa-requirements', $this->requirementsService->pageData($request));
    }

    /**
     * Public visa services listing
     */
    public function index()
    {
        return Inertia::render('visa-services', [
            'visas' => $this->visaService->active(),
        ]);
    }

    /**
     * Show the visa detail page
     */
    public function show(Visa $visa)
    {
        return Inertia::render('visas/visa-detail', [
            'visa' => $visa,
            'visas' => $this->visaService->active(),
        ]);
    }
}
