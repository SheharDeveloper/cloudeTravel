<?php

namespace Database\Seeders;

use App\Models\Tour;
use App\Models\Highlight;
use App\Models\Itinerary;
use App\Models\KeyDestination;
use App\Models\TermsCondition;
use Illuminate\Database\Seeder;

class TourSeeder extends Seeder
{
    public function run(): void
    {
        $tours = [
            [
                'title' => 'London City Experience',
                'featured' => true,
                'description' => 'Explore the capital of England with its iconic landmarks and rich history.'
            ],
            [
                'title' => 'Paris Romance Package',
                'featured' => true,
                'description' => 'Experience the magic of Paris with world-class museums and charming streets.'
            ],
            [
                'title' => 'Swiss Alps Adventure',
                'featured' => true,
                'description' => 'Discover breathtaking mountain landscapes and luxury Swiss hospitality.'
            ],
            [
                'title' => 'Italian Renaissance Tour',
                'featured' => true,
                'description' => 'Immerse yourself in art, culture, and cuisine across Italy.'
            ],
            [
                'title' => 'Barcelona Beach Escape',
                'featured' => true,
                'description' => 'Relax on beautiful beaches and explore Gaudí architecture in Barcelona.'
            ],
            [
                'title' => 'Amsterdam Waterways',
                'featured' => false,
                'description' => 'Navigate scenic canals and discover Dutch culture and heritage.'
            ],
            [
                'title' => 'Vienna Classical Music Tour',
                'featured' => false,
                'description' => 'Immerse in classical music history and imperial architecture.'
            ],
            [
                'title' => 'Prague Old Town',
                'featured' => false,
                'description' => 'Walk through medieval streets and historic squares of Prague.'
            ],
            [
                'title' => 'Berlin Historical Journey',
                'featured' => false,
                'description' => 'Explore the significant historical sites and modern culture.'
            ],
            [
                'title' => 'Stockholm Nordic Explorer',
                'featured' => false,
                'description' => 'Discover Scandinavian culture across beautiful Stockholm islands.'
            ]
        ];

        foreach ($tours as $tourData) {
            $tour = Tour::create([
                'tour_title' => $tourData['title'],
                'hero_title' => $tourData['title'] . ' Experience',
                'hero_subtitle' => 'Unforgettable Journey',
                'short_description' => $tourData['description'],
                'full_description' => 'Join us on an unforgettable journey. ' . $tourData['description'] . ' Our carefully curated tour packages offer the perfect blend of adventure, culture, and relaxation. With experienced guides, comfortable accommodations, and personalized service, we ensure every moment of your journey is memorable.',
                'country' => $this->getCountry($tourData['title']),
                'city' => $this->getCity($tourData['title']),
                'duration_days' => rand(3, 8),
                'start_date' => date('Y-m-d', strtotime('+' . rand(1, 120) . ' days')),
                'end_date' => date('Y-m-d', strtotime('+' . rand(125, 135) . ' days')),
                'status' => 'active',
                'featured' => $tourData['featured'],
                'early_booking_price_text' => '$' . rand(1500, 5000),
                'feature_image' => '',
                'banner_images' => ''
            ]);

            // Create highlights for each tour
            $highlights = [
                ['title' => 'Expert Guidance', 'description' => 'Professional guides with years of experience'],
                ['title' => 'Luxury Stay', 'description' => '5-star accommodations throughout the journey'],
                ['title' => 'Local Cuisine', 'description' => 'Authentic food experiences and dining'],
                ['title' => 'Small Groups', 'description' => 'Intimate groups for personalized attention']
            ];

            foreach ($highlights as $idx => $highlight) {
                Highlight::create([
                    'tour_id' => $tour->id,
                    'title' => $highlight['title'],
                    'description' => $highlight['description'],
                    'short_order' => $idx + 1
                ]);
            }

            // Create itineraries for each tour
            $itineraries = [
                [
                    'day' => 1,
                    'title' => 'Arrival & City Exploration',
                    'location' => $this->getCity($tourData['title']),
                    'description' => 'Arrive and settle into your luxury accommodation. Evening guided city tour of iconic landmarks.'
                ],
                [
                    'day' => 2,
                    'title' => 'Museums & Cultural Sites',
                    'location' => $this->getCity($tourData['title']),
                    'description' => 'Visit world-renowned museums and historical sites. Explore the rich cultural heritage.'
                ]
            ];

            $startDate = strtotime($tour->start_date);
            foreach ($itineraries as $idx => $itinerary) {
                Itinerary::create([
                    'tour_id' => $tour->id,
                    'day' => $itinerary['day'],
                    'date' => date('Y-m-d', strtotime('+' . ($itinerary['day'] - 1) . ' days', $startDate)),
                    'title' => $itinerary['title'],
                    'location' => $itinerary['location'],
                    'description' => $itinerary['description'],
                    'images' => '',
                    'short_order' => $idx + 1
                ]);
            }

            // Create key destinations for each tour
            $destinations = [
                ['name' => 'Historic City Center', 'location' => $this->getCity($tourData['title'])],
                ['name' => 'Museum District', 'location' => $this->getCity($tourData['title'])],
                ['name' => 'Local Market', 'location' => $this->getCity($tourData['title'])],
                ['name' => 'Famous Monument', 'location' => $this->getCity($tourData['title'])]
            ];

            foreach ($destinations as $dest) {
                KeyDestination::create([
                    'tour_id' => $tour->id,
                    'destination_name' => $dest['name'],
                    'location' => $dest['location'],
                    'description' => 'Experience the authentic charm and culture of ' . $dest['name']
                ]);
            }

            // Create terms & conditions for each tour
            TermsCondition::create([
                'tour_id' => $tour->id,
                'type' => 'package_includes',
                'policy' => 'Accommodation in 5-star hotels
Flight tickets & airport transfers
Meals - Breakfast and Dinner daily
Professional tour guide
Entrance fees to all monuments
Travel insurance
Comfortable air-conditioned coach'
            ]);

            TermsCondition::create([
                'tour_id' => $tour->id,
                'type' => 'package_does_not_include',
                'policy' => 'Personal shopping and souvenirs
Alcoholic beverages
Activities not mentioned in itinerary
Gratuities for guides and staff
Optional excursions
Visa charges'
            ]);
        }
    }

    private function getCountry($title)
    {
        if (str_contains($title, 'London')) return 'United Kingdom';
        if (str_contains($title, 'Paris')) return 'France';
        if (str_contains($title, 'Swiss')) return 'Switzerland';
        if (str_contains($title, 'Italian')) return 'Italy';
        if (str_contains($title, 'Barcelona')) return 'Spain';
        if (str_contains($title, 'Amsterdam')) return 'Netherlands';
        if (str_contains($title, 'Vienna')) return 'Austria';
        if (str_contains($title, 'Prague')) return 'Czech Republic';
        if (str_contains($title, 'Berlin')) return 'Germany';
        if (str_contains($title, 'Stockholm')) return 'Sweden';
        return 'Europe';
    }

    private function getCity($title)
    {
        if (str_contains($title, 'London')) return 'London';
        if (str_contains($title, 'Paris')) return 'Paris';
        if (str_contains($title, 'Swiss')) return 'Zurich';
        if (str_contains($title, 'Italian')) return 'Rome';
        if (str_contains($title, 'Barcelona')) return 'Barcelona';
        if (str_contains($title, 'Amsterdam')) return 'Amsterdam';
        if (str_contains($title, 'Vienna')) return 'Vienna';
        if (str_contains($title, 'Prague')) return 'Prague';
        if (str_contains($title, 'Berlin')) return 'Berlin';
        if (str_contains($title, 'Stockholm')) return 'Stockholm';
        return 'Europe';
    }
}
