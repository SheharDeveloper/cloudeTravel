<?php

namespace App\Http\Requests;

use App\Models\VisaField;
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

    /** A field id must exist under the section it was submitted with, and only once. */
    public function after(): array
    {
        return [function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $owners = VisaField::pluck('visa_section_id', 'id');
            $seen = [];

            foreach ($this->input('sections', []) as $sectionIndex => $section) {
                foreach ($section['fields'] ?? [] as $fieldIndex => $field) {
                    $fieldId = (int) $field['visa_field_id'];
                    $key = "sections.{$sectionIndex}.fields.{$fieldIndex}.visa_field_id";

                    if ((int) $owners->get($fieldId) !== (int) $section['visa_section_id']) {
                        $validator->errors()->add($key, 'This field does not belong to the selected section.');
                    } elseif (isset($seen[$fieldId])) {
                        $validator->errors()->add($key, 'This field was submitted more than once.');
                    }

                    $seen[$fieldId] = true;
                }
            }
        }];
    }
}
