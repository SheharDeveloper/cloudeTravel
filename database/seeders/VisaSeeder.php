<?php

namespace Database\Seeders;

use App\Models\Visa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VisaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates 15 visa records - 5 featured, 10 regular
     */
    public function run(): void
    {
        $visas = [
            // Featured Visas (5)
            [
                'name' => 'Schengen Visa',
                'title' => 'European Travel Document',
                'description' => 'Travel freely across 27 European countries with a single visa. Perfect for exploring the culture, history, and beauty of Europe.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'UK Visitor Visa',
                'title' => 'Visit United Kingdom',
                'description' => 'Explore the United Kingdom with our comprehensive UK Visitor Visa. Valid for up to 6 months with flexible entry and exit dates.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'USA Tourist Visa',
                'title' => 'Explore America',
                'description' => 'Visit the United States for tourism, business, or short-term stays. B-1/B-2 visa valid for up to 10 years.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'Canada Visitor Visa',
                'title' => 'Discover Canada',
                'description' => 'Experience the natural beauty and vibrant cities of Canada. Multi-entry visitor visa available.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'Australia Tourist Visa',
                'title' => 'Visit Australia',
                'description' => 'Explore the land down under with our Australia Tourist Visa (Subclass 600). Perfect for holidays and short visits.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => true,
            ],

            // Regular Visas (10)
            [
                'name' => 'India Visitor Visa',
                'title' => 'Experience India',
                'description' => 'Visit India for tourism and short stays. Valid for various duration options with flexible entry and exit dates.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'Japan Visitor Visa',
                'title' => 'Experience Japan',
                'description' => 'Visit Japan for tourism and short stays. Valid for up to 90 days without a visa for citizens of many countries.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'Singapore Visitor Pass',
                'title' => 'Gateway to Asia',
                'description' => 'Explore the modern city-state of Singapore. Easy visa approval for tourists and business visitors.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'Thailand Tourist Visa',
                'title' => 'Discover Thailand',
                'description' => 'Experience the culture, cuisine, and beaches of Thailand. Flexible tourist visa options available.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'Dubai Visit Visa',
                'title' => 'Experience the Emirates',
                'description' => 'Visit Dubai and the United Arab Emirates. Easy tourist visa for exploring modern luxury and Arabian culture.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'New Zealand Visitor Visa',
                'title' => 'Adventure Awaits',
                'description' => 'Explore the stunning landscapes and adventure activities of New Zealand.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'France Schengen Visa',
                'title' => 'Experience French Culture',
                'description' => 'Visit France and discover the art, cuisine, and romance of this beautiful European country.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'Germany Schengen Visa',
                'title' => 'Visit Germany',
                'description' => 'Explore Germany\'s culture, history, and modern innovations. Valid for travel in Schengen area.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'Italy Schengen Visa',
                'title' => 'Ancient & Modern Italy',
                'description' => 'Discover the history, art, and cuisine of Italy. Perfect for exploring Rome, Venice, and Florence.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'Spain Schengen Visa',
                'title' => 'Passionate Spain',
                'description' => 'Experience the culture, beaches, and vibrant cities of Spain.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'Switzerland Visa',
                'title' => 'Alpine Beauty',
                'description' => 'Visit Switzerland and experience the Alps, cities, and natural beauty. Schengen area access included.',
                'image' => '/storage/visas/india.jpg',
                'status' => 1,
                'is_featured' => false,
            ],
        ];

        foreach ($visas as $visa) {
            Visa::create($visa);
        }
    }
}
