<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates 10 package records - 5 featured, 5 regular
     */
    public function run(): void
    {
        // Default fallback image if specific image is not available
        $defaultImage = '/storage/packages/honeymoon.jpg';

        $packages = [
            // Featured Packages (5)
            [
                'name' => 'Europe Dream Tour',
                'title' => '10-Day Europe Explorer Package',
                'description' => 'Experience the best of Europe with visits to France, Italy, and Switzerland. Includes luxury hotel stays and guided tours.',
                'image' => file_exists(public_path('/storage/packages/europe.jpg')) ? '/storage/packages/europe.jpg' : $defaultImage,
                'price' => 2500,
                'currency' => 'USD',
                'origin_country' => 'India',
                'destination_country' => 'France',
                'hotel_name' => 'Grand Paris Hotel',
                'hotel_stars' => 5,
                'duration_days' => 10,
                'travel_export_included' => true,
                'visa_service_included' => true,
                'status' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'Dubai Luxury Escape',
                'title' => '7-Day Dubai & Abu Dhabi Package',
                'description' => 'Explore the modern wonders of Dubai and the cultural heritage of Abu Dhabi. Stay in premium hotels and enjoy world-class amenities.',
                'image' => file_exists(public_path('/storage/packages/dubai.jpg')) ? '/storage/packages/dubai.jpg' : $defaultImage,
                'price' => 1800,
                'currency' => 'USD',
                'origin_country' => 'India',
                'destination_country' => 'UAE',
                'hotel_name' => 'Burj Al Arab',
                'hotel_stars' => 5,
                'duration_days' => 7,
                'travel_export_included' => true,
                'visa_service_included' => false,
                'status' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'Singapore & Malaysia Combo',
                'title' => '9-Day Singapore & Malaysia Adventure',
                'description' => 'Discover the urban marvels of Singapore and the tropical beauty of Malaysia. Perfect blend of culture and nature.',
                'image' => file_exists(public_path('/storage/packages/honeymoon.jpg')) ? '/storage/packages/honeymoon.jpg' : $defaultImage,
                'price' => 1500,
                'currency' => 'USD',
                'origin_country' => 'India',
                'destination_country' => 'Singapore',
                'hotel_name' => 'Marina Bay Sands',
                'hotel_stars' => 5,
                'duration_days' => 9,
                'travel_export_included' => true,
                'visa_service_included' => false,
                'status' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'Japan Cherry Blossom Tour',
                'title' => '12-Day Japan Culture & Nature',
                'description' => 'Experience Japan during cherry blossom season. Visit Tokyo, Kyoto, and Osaka with cultural immersion experiences.',
                'image' => file_exists(public_path('/storage/packages/adventure.jpg')) ? '/storage/packages/adventure.jpg' : $defaultImage,
                'price' => 2200,
                'currency' => 'USD',
                'origin_country' => 'India',
                'destination_country' => 'Japan',
                'hotel_name' => 'Tokyo Grand Hotel',
                'hotel_stars' => 4,
                'duration_days' => 12,
                'travel_export_included' => true,
                'visa_service_included' => true,
                'status' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'USA Multi-City Explorer',
                'title' => '15-Day USA East Coast Tour',
                'description' => 'Explore New York, Washington DC, and Philadelphia. Discover American history, culture, and iconic landmarks.',
                'image' => file_exists(public_path('/storage/packages/business.jpg')) ? '/storage/packages/business.jpg' : $defaultImage,
                'price' => 2800,
                'currency' => 'USD',
                'origin_country' => 'India',
                'destination_country' => 'USA',
                'hotel_name' => 'New York Hilton',
                'hotel_stars' => 4,
                'duration_days' => 15,
                'travel_export_included' => true,
                'visa_service_included' => true,
                'status' => 1,
                'is_featured' => true,
            ],

            // Regular Packages (5)
            [
                'name' => 'Thailand Beach Holiday',
                'title' => '7-Day Thailand Beach Getaway',
                'description' => 'Relax on beautiful Thai beaches and experience local culture. Includes snorkeling and island hopping.',
                'image' => file_exists(public_path('/storage/packages/beach.jpg')) ? '/storage/packages/beach.jpg' : $defaultImage,
                'price' => 1200,
                'currency' => 'USD',
                'origin_country' => 'India',
                'destination_country' => 'Thailand',
                'hotel_name' => 'Phuket Beach Resort',
                'hotel_stars' => 4,
                'duration_days' => 7,
                'travel_export_included' => false,
                'visa_service_included' => false,
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'Canada Wildlife Adventure',
                'title' => '10-Day Canada Natural Wonders',
                'description' => 'Explore Niagara Falls, Rocky Mountains, and natural parks. Perfect for nature lovers and adventure seekers.',
                'image' => file_exists(public_path('/storage/packages/hiking.jpg')) ? '/storage/packages/hiking.jpg' : $defaultImage,
                'price' => 2000,
                'currency' => 'USD',
                'origin_country' => 'India',
                'destination_country' => 'Canada',
                'hotel_name' => 'Banff Springs Hotel',
                'hotel_stars' => 4,
                'duration_days' => 10,
                'travel_export_included' => true,
                'visa_service_included' => true,
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'Australia Outback Safari',
                'title' => '12-Day Australia Outback & Beaches',
                'description' => 'Discover the Australian Outback, Great Barrier Reef, and Sydney beaches. A complete Australian experience.',
                'image' => file_exists(public_path('/storage/packages/safari.jpg')) ? '/storage/packages/safari.jpg' : $defaultImage,
                'price' => 2600,
                'currency' => 'USD',
                'origin_country' => 'India',
                'destination_country' => 'Australia',
                'hotel_name' => 'Sydney Opera Hotel',
                'hotel_stars' => 5,
                'duration_days' => 12,
                'travel_export_included' => true,
                'visa_service_included' => true,
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'UK Royal Heritage Tour',
                'title' => '8-Day UK London & Countryside',
                'description' => 'Explore London\'s royal palaces, museums, and historic countryside estates. Experience British culture and heritage.',
                'image' => file_exists(public_path('/storage/packages/heritage.jpg')) ? '/storage/packages/heritage.jpg' : $defaultImage,
                'price' => 1700,
                'currency' => 'USD',
                'origin_country' => 'India',
                'destination_country' => 'United Kingdom',
                'hotel_name' => 'London Mayfair Hotel',
                'hotel_stars' => 4,
                'duration_days' => 8,
                'travel_export_included' => true,
                'visa_service_included' => true,
                'status' => 1,
                'is_featured' => false,
            ],
            [
                'name' => 'New Zealand Adventure',
                'title' => '14-Day New Zealand North & South',
                'description' => 'Experience adventure in New Zealand with activities in both North and South Islands. Stunning landscapes and thrilling experiences.',
                'image' => file_exists(public_path('/storage/packages/nature.jpg')) ? '/storage/packages/nature.jpg' : $defaultImage,
                'price' => 2400,
                'currency' => 'USD',
                'origin_country' => 'India',
                'destination_country' => 'New Zealand',
                'hotel_name' => 'Queenstown Adventure Lodge',
                'hotel_stars' => 3,
                'duration_days' => 14,
                'travel_export_included' => true,
                'visa_service_included' => true,
                'status' => 1,
                'is_featured' => false,
            ],
        ];

        foreach ($packages as $package) {
            Package::create($package);
        }
    }
}
