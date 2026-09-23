<?php

namespace App\Http\Controllers;

use App\Services\DocumentService;
use App\Services\SettingsService;
use App\Services\VisaService;

class HomeController extends Controller
{
    protected $documentService;
    protected $settingsService;
    protected VisaService $visaService;

    public function __construct(DocumentService $documentService, SettingsService $settingsService, VisaService $visaService)
    {
        $this->visaService = $visaService;
        $this->documentService = $documentService;
        $this->settingsService = $settingsService;
    }

    public function index()
    {
        $documents = $this->documentService->getActiveDocuments();
        $isreviewEnabled = $this->settingsService->getIsreviewEnabled();

        return inertia('home', [
            'documents' => $documents,
            'isreviewEnabled' => $isreviewEnabled,
            'featuredVisas' => $this->visaService->featured(),
            'visas' => $this->visaService->active(),
        ]);
    }
}
