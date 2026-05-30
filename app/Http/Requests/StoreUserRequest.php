<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'phone_number' => 'required|string|max:20|regex:/^[0-9\-\+\s]+$/',
            'picture' => 'nullable|binary',
            'parent_id' => 'nullable|exists:users,id',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'Full Name',
            'email' => 'Email Address',
            'phone_number' => 'Contact Number',
            'picture' => 'Profile Picture',
            'parent_id' => 'Parent User',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The Full Name field is required.',
            'name.max' => 'The Full Name cannot exceed 255 characters.',
            'email.required' => 'The Email Address field is required.',
            'email.email' => 'The Email Address must be a valid email.',
            'email.unique' => 'This Email Address is already registered.',
            'phone_number.required' => 'The Contact Number field is required.',
            'phone_number.regex' => 'The Contact Number format is invalid.',
            'parent_id.exists' => 'The selected Parent User does not exist.',
        ];
    }
}
