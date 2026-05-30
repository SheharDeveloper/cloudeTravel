<?php

namespace Database\Seeders;

use App\Models\HeroImage;
use Illuminate\Database\Seeder;

class HeroImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HeroImage::create([
            'image_url' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80',
            'title' => 'Discover the World with CloudTravel',
            'subtitle' => 'Book flights, hotels, and visas seamlessly in one platform.',
            'status' => 1,
            'order' => 1,
        ]);

        HeroImage::create([
            'image_url' => 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80',
            'title' => 'Explore Amazing Destinations',
            'subtitle' => 'Find your next adventure with our premium travel packages.',
            'status' => 1,
            'order' => 2,
        ]);

        HeroImage::create([
            'image_url' => 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80',
            'title' => 'Travel with Confidence',
            'subtitle' => 'Experience world-class service and unforgettable memories.',
            'status' => 1,
            'order' => 3,
        ]);
    }
}
