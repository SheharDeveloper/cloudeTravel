<?php

namespace App\Http\Requests;

use App\Models\ApplicationDocument;
use Illuminate\Foundation\Http\FormRequest;

/** The superadmin approves an uploaded document, or rejects it with the reason. */
class ReviewApplicationDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user('web')?->hasRole('superadmin');
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:' . ApplicationDocument::REVIEW_APPROVED . ',' . ApplicationDocument::REVIEW_REJECTED,
            'note' => 'required_if:status,' . ApplicationDocument::REVIEW_REJECTED . '|nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'note.required_if' => 'Tell the agency why the document is not correct.',
        ];
    }
}
