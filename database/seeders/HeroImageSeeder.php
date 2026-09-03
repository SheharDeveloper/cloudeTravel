<?php

namespace Database\Seeders;

use App\Models\HeroImage;
use App\Models\User;
use Illuminate\Database\Seeder;

class HeroImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Owned by the superadmin: this is the global/default set shown to
        // any agency that hasn't added its own hero images.
        $firstUser = User::orderBy('id')->first();
        $owner = $firstUser ? ['owner_type' => User::class, 'owner_id' => $firstUser->id] : [];

        HeroImage::create($owner + [
            'image_url' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80',
            'title' => 'Discover the World with CloudTravel',
            'subtitle' => 'Book flights, hotels, and visas seamlessly in one platform.',
            'status' => 1,
            'order' => 1,
        ]);

        HeroImage::create($owner + [
            'image_url' => 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80',
            'title' => 'Explore Amazing Destinations',
            'subtitle' => 'Find your next adventure with our premium travel packages.',
            'status' => 1,
            'order' => 2,
        ]);

        HeroImage::create($owner + [
            'image_url' => 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80',
            'title' => 'Travel with Confidence',
            'subtitle' => 'Experience world-class service and unforgettable memories.',
            'status' => 1,
            'order' => 3,
        ]);
    }
}
