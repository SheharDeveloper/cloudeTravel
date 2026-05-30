<?php

namespace App\Services;

use App\Models\Document;

class DocumentService
{
    public function getAllDocuments()
    {
        return Document::with('agencyDocument')->paginate(15);
    }

    public function getDocumentById(int $id)
    {
        return Document::with('agencyDocument')->findOrFail($id);
    }

    public function createDocument(array $data)
    {
        return Document::create($data);
    }

    public function updateDocument(int $id, array $data)
    {
        $document = Document::findOrFail($id);
        $document->update($data);
        return $document;
    }

    public function deleteDocument(int $id)
    {
        $document = Document::findOrFail($id);
        return $document->delete();
    }

    public function getDocumentsByAgencyDocument(int $agencyDocumentId)
    {
        return Document::where('agency_document_id', $agencyDocumentId)->get();
    }
}
