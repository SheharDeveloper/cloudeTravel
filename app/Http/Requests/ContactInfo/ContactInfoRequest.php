<?php

namespace App\Http\Requests\ContactInfo;

use Illuminate\Foundation\Http\FormRequest;

class ContactInfoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'location' => 'nullable|string',
            'address' => 'nullable|string',
            'facebook_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'about_text' => 'nullable|string',
            'logo' => 'nullable|file|mimes:jpeg,png,gif,webp|max:5120',
            'get_in_touch_image' => 'nullable|file|mimes:jpeg,png,gif,webp|max:5120',
            'loader_video' => 'nullable|file|mimes:mp4,webm,mov|max:20480',
        ];
    }

    /**
     * Validated data plus any uploaded files, ready to hand to
     * ContactInfoService::save().
     */
    public function payload(): array
    {
        $data = $this->validated();

        foreach (['logo', 'get_in_touch_image', 'loader_video'] as $fileField) {
            if ($this->hasFile($fileField)) {
                $data[$fileField] = $this->file($fileField);
            }
        }

        return $data;
    }
}
