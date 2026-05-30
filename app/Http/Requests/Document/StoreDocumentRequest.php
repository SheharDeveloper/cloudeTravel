<?php

namespace App\Http\Requests\Document;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'agency_document_id' => 'required|exists:agency_documents,id',
            'document_name' => 'required|string|max:255',
            'path' => 'required|string',
            'size' => 'nullable|string|max:50',
        ];
    }

    public function attributes(): array
    {
        return [
            'agency_document_id' => 'Agency Document',
            'document_name' => 'Document Name',
            'path' => 'File Path',
            'size' => 'File Size',
        ];
    }

    public function messages(): array
    {
        return [
            'agency_document_id.required' => 'The Agency Document field is required.',
            'agency_document_id.exists' => 'The selected Agency Document does not exist.',
            'document_name.required' => 'The Document Name is required.',
            'path.required' => 'The File Path is required.',
        ];
    }
}