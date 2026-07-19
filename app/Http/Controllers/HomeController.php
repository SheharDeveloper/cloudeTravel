<?php

namespace App\Http\Controllers;

use App\Services\DocumentService;
use App\Services\SettingsService;

class HomeController extends Controller
{
    protected $documentService;
    protected $settingsService;

    public function __construct(DocumentService $documentService, SettingsService $settingsService)
    {
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
        ]);
    }
}
