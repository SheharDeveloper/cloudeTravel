<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAgencyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $agencyId = $this->route('agency');
        return [
            'user_id' => 'sometimes|required|exists:users,id',
            'agency_name' => 'sometimes|required|string|max:255',
            'legal_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'phone_number' => 'sometimes|required|string|max:20|regex:/^[0-9\-\+\s]+$/',
            'alternate_phone' => 'nullable|string|max:20|regex:/^[0-9\-\+\s]+$/',
            'country' => 'sometimes|required|string|max:100',
            'state' => 'sometimes|required|string|max:100',
            'city' => 'sometimes|required|string|max:100',
            'postal_code' => 'sometimes|required|string|max:20',
            'address' => 'sometimes|required|string|max:500',
            'registration_number' => 'nullable|string|max:255|unique:agencies,registration_number,' . $agencyId,
            'gst_number' => 'nullable|string|max:255|unique:agencies,gst_number,' . $agencyId,
            'pan_number' => 'nullable|string|max:255|unique:agencies,pan_number,' . $agencyId,
            'account_number' => 'nullable|string|max:255',
            'ifsc_code' => 'nullable|string|max:50',
            'note' => 'nullable|string',
            'tax_status' => 'sometimes|required|integer|in:0,1',
        ];
    }

    public function attributes(): array
    {
        return [
            'user_id' => 'User',
            'agency_name' => 'Agency Name',
            'legal_name' => 'Legal Company Name',
            'email' => 'Agency Email',
            'phone_number' => 'Primary Phone',
            'alternate_phone' => 'Alternate Phone',
            'country' => 'Country',
            'state' => 'State/Province',
            'city' => 'City',
            'postal_code' => 'Postal Code',
            'address' => 'Street Address',
            'registration_number' => 'Registration Number',
            'gst_number' => 'GST Number',
            'pan_number' => 'PAN Number',
            'account_number' => 'Bank Account Number',
            'ifsc_code' => 'IFSC Code',
            'note' => 'Notes',
            'tax_status' => 'Tax Status',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'The User field is required.',
            'user_id.exists' => 'The selected User does not exist.',
            'agency_name.required' => 'The Agency Name is required.',
            'legal_name.required' => 'The Legal Company Name is required.',
            'email.required' => 'The Agency Email is required.',
            'email.email' => 'The Agency Email must be valid.',
            'phone_number.required' => 'The Primary Phone is required.',
            'phone_number.regex' => 'The Primary Phone format is invalid.',
            'alternate_phone.regex' => 'The Alternate Phone format is invalid.',
            'gst_number.unique' => 'This GST Number is already registered.',
            'pan_number.unique' => 'This PAN Number is already registered.',
            'registration_number.unique' => 'This Registration Number is already registered.',
            'tax_status.in' => 'The Tax Status must be either Active or Inactive.',
        ];
    }
}
