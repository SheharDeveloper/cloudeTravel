<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * StoreTourRequest - Validates tour creation request data
 * Ensures all required fields are present and properly formatted
 * Handles file validation for images
 */
class StoreTourRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // Basic tour information validation
            'tour_title' => 'required|string|max:255',
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'nullable|string',
            'short_description' => 'nullable|string',
            'country' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'duration_days' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:active,inactive,draft',
            'early_booking_price_text' => 'nullable|string|max:255',

            // Image validation
            'feature_image' => 'nullable|image|max:10240',
            'banner_images' => 'nullable|array',
            'banner_images.*' => 'image|max:10240',

            // Highlights validation
            'highlights' => 'nullable|array',
            'highlights.*.title' => 'required_with:highlights|string',
            'highlights.*.description' => 'nullable|string',
            'highlights.*.short_order' => 'nullable|integer',

            // Itineraries validation
            'itineraries' => 'nullable|array',
            'itineraries.*.day' => 'required_with:itineraries|integer',
            'itineraries.*.date' => 'required_with:itineraries|date',
            'itineraries.*.title' => 'required_with:itineraries|string',
            'itineraries.*.location' => 'required_with:itineraries|string',
            'itineraries.*.description' => 'nullable|string',
            'itineraries.*.image' => 'nullable|image|max:10240',

            // Key destinations validation
            'key_destinations' => 'nullable|array',
            'key_destinations.*.destination_name' => 'required_with:key_destinations|string',
            'key_destinations.*.location' => 'nullable|string',
            'key_destinations.*.description' => 'nullable|string',

            // Terms and conditions validation
            'terms_conditions' => 'nullable|array',
            'terms_conditions.*.type' => 'required_with:terms_conditions|in:package_includes,package_does_not_include',
            'terms_conditions.*.policy' => 'required_with:terms_conditions|string',
        ];
    }

    /**
     * Get custom messages for validator errors
     */
    public function messages(): array
    {
        return [
            'tour_title.required' => 'Tour title is required',
            'hero_title.required' => 'Hero title is required',
            'country.required' => 'Country is required',
            'city.required' => 'City is required',
            'duration_days.required' => 'Duration in days is required',
            'duration_days.min' => 'Duration must be at least 1 day',
            'start_date.required' => 'Start date is required',
            'end_date.required' => 'End date is required',
            'end_date.after_or_equal' => 'End date must be after or equal to start date',
            'status.required' => 'Status is required',
            'status.in' => 'Status must be active, inactive, or draft',
            'feature_image.image' => 'Feature image must be a valid image',
            'feature_image.max' => 'Feature image must not exceed 10MB',
        ];
    }
}
