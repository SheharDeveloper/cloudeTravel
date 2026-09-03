<?php

namespace Database\Seeders;

use App\Models\ContactInfo;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContactInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Owned by the superadmin: this is the global/default record shown
        // to any agency that hasn't added its own contact info.
        $firstUser = User::orderBy('id')->first();

        ContactInfo::create([
            'owner_type' => $firstUser ? User::class : null,
            'owner_id' => $firstUser?->id,
            'email' => 'info@cloudtravel.com',
            'phone' => '+1 (555) 123-4567',
            'location' => 'London, United Kingdom',
            'address' => '123 Travel Street, London, UK 10001',
            'facebook_url' => 'https://facebook.com/cloudtravel',
            'instagram_url' => 'https://instagram.com/cloudtravel',
            'twitter_url' => 'https://twitter.com/cloudtravel',
            'linkedin_url' => 'https://linkedin.com/company/cloudtravel',
            'about_text' => 'CloudTravel is your premier travel companion, offering seamless booking solutions for flights, hotels, visas, and unforgettable travel experiences worldwide. We\'ve been serving travelers since 2020 with excellence and dedication.',
            'logo' => '/images/logo.png',
            'get_in_touch_image' => '/images/logo.png',
        ]);
    }
}
