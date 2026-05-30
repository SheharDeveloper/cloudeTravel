<?php

namespace App\Services;

use App\Models\AgencyDocument;

class AgencyDocumentService
{
    public function getAllAgencyDocuments()
    {
        return AgencyDocument::with('agency', 'documents')->paginate(15);
    }

    public function getAgencyDocumentById(int $id)
    {
        return AgencyDocument::with('agency', 'documents')->findOrFail($id);
    }

    public function createAgencyDocument(array $data)
    {
        return AgencyDocument::create($data);
    }

    public function updateAgencyDocument(int $id, array $data)
    {
        $document = AgencyDocument::findOrFail($id);
        $document->update($data);
        return $document;
    }

    public function deleteAgencyDocument(int $id)
    {
        $document = AgencyDocument::findOrFail($id);
        return $document->delete();
    }

    public function getDocumentsByAgency(int $agencyId)
    {
        return AgencyDocument::where('agency_id', $agencyId)->with('documents')->get();
    }
}
