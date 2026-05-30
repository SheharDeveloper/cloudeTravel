<?php

namespace App\Http\Requests\AgencyDocument;

use Illuminate\Foundation\Http\FormRequest;

class StoreAgencyDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'agency_id' => 'required|exists:agencies,id',
            'document_name' => 'required|string|max:255',
            'document_type' => 'required|string|max:100',
            'document_master_id' => 'nullable|integer|exists:agency_documents,id',
            'upload_status' => 'required|integer|in:0,1',
        ];
    }

    public function attributes(): array
    {
        return [
            'agency_id' => 'Agency',
            'document_name' => 'Document Name',
            'document_type' => 'Document Type',
            'document_master_id' => 'Parent Document',
            'upload_status' => 'Upload Status',
        ];
    }

    public function messages(): array
    {
        return [
            'agency_id.required' => 'The Agency field is required.',
            'agency_id.exists' => 'The selected Agency does not exist.',
            'document_name.required' => 'The Document Name is required.',
            'document_type.required' => 'The Document Type is required.',
            'document_master_id.exists' => 'The selected Parent Document does not exist.',
            'upload_status.in' => 'The Upload Status must be either 0 or 1.',
        ];
    }
}