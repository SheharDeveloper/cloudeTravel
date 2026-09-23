<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVisaDocumentsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user('web')?->hasRole('superadmin');
    }

    public function rules(): array
    {
        return [
            'documents' => 'present|array',
            'documents.*.id' => 'nullable|integer',
            'documents.*.name' => 'required|string|max:255|distinct:ignore_case',
            'documents.*.description' => 'nullable|string|max:1000',
            'documents.*.is_required' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'documents.*.name.required' => 'Every document needs a name.',
            'documents.*.name.distinct' => 'Each document name can only be added once.',
        ];
    }
}
