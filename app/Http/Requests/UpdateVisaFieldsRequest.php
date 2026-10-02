<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateVisaFieldsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user('web')?->hasRole('superadmin');
    }

    public function rules(): array
    {
        return [
            'sections' => 'present|array',
            'sections.*.visa_section_id' => 'required|integer|distinct|exists:visa_sections,id',
            'sections.*.fields' => 'nullable|array',
            'sections.*.fields.*.visa_field_id' => 'required|integer|exists:visa_fields,id',
            'sections.*.fields.*.is_required' => 'nullable|boolean',
        ];
    }

    /**
     * A field may be listed under any section (it's moved there for this
     * visa), but only once.
     */
    public function after(): array
    {
        return [function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $seen = [];

            foreach ($this->input('sections', []) as $sectionIndex => $section) {
                foreach ($section['fields'] ?? [] as $fieldIndex => $field) {
                    $fieldId = (int) $field['visa_field_id'];

                    if (isset($seen[$fieldId])) {
                        $validator->errors()->add("sections.{$sectionIndex}.fields.{$fieldIndex}.visa_field_id", 'This field was submitted more than once.');
                    }

                    $seen[$fieldId] = true;
                }
            }
        }];
    }
}
