<?php

namespace App\Services;

use App\Models\ContactInfo;
use Illuminate\Support\Facades\Storage;

class ContactInfoService
{
    /**
     * Get contact info
     */
    public function getInfo(): ?ContactInfo
    {
        return ContactInfo::first();
    }

    /**
     * Save or update contact info
     */
    public function save(array $data): ContactInfo
    {
        $contact = ContactInfo::first();

        // Handle logo file upload
        if (isset($data['logo']) && is_object($data['logo'])) {
            // Delete old file if exists
            if ($contact && $contact->logo && strpos($contact->logo, 'storage/') !== false) {
                $oldPath = str_replace('/storage/', '', $contact->logo);
                Storage::disk('public')->delete($oldPath);
            }
            $file = $data['logo'];
            $path = $file->store('contact', 'public');
            $data['logo'] = Storage::url($path);
        } else if (!isset($data['logo']) && $contact) {
            // Keep existing logo if no file uploaded
            unset($data['logo']);
        }

        // Handle get_in_touch_image file upload
        if (isset($data['get_in_touch_image']) && is_object($data['get_in_touch_image'])) {
            // Delete old file if exists
            if ($contact && $contact->get_in_touch_image && strpos($contact->get_in_touch_image, 'storage/') !== false) {
                $oldPath = str_replace('/storage/', '', $contact->get_in_touch_image);
                Storage::disk('public')->delete($oldPath);
            }
            $file = $data['get_in_touch_image'];
            $path = $file->store('contact', 'public');
            $data['get_in_touch_image'] = Storage::url($path);
        } else if (!isset($data['get_in_touch_image']) && $contact) {
            // Keep existing image if no file uploaded
            unset($data['get_in_touch_image']);
        }

        if ($contact) {
            $contact->update($data);
        } else {
            $contact = ContactInfo::create($data);
        }

        return $contact;
    }
}
