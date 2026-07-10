<?php

namespace Database\Seeders;

use App\Models\SpecialOffer;
use Illuminate\Database\Seeder;

class SpecialOfferSeeder extends Seeder
{
    public function run(): void
    {
        $offers = [
            // 1. Dubai - Flight + Hotel
            [
                'name' => 'Dubai Luxury Experience',
                'type' => 'Flight',
                'description' => 'Experience luxury in Dubai with flights and 5-star accommodation',
                'sub_description' => 'Flights + Burj Al Arab Hotel + City Tours',
                'duration_days' => 5,
                'duration_nights' => 4,
                'total_price' => 850,
                'is_active' => true,
                'is_featured' => true,
                'flight_name' => 'Emirates EK501',
                'hotel_name' => 'Burj Al Arab',
                'hotel_star_rating' => 5,
                'visa_name' => null,
                'is_visa' => false,
                'transport_name' => null,
                'transport_type' => null,
                'is_transport' => false,
                'rating' => 4.8,
            ],

            // 2. Paris Europe - Flight + Hotel + Visa
            [
                'name' => 'Paris European Adventure',
                'type' => 'Hotel',
                'description' => 'Explore the beauty of Paris with premium hotel and visa assistance',
                'sub_description' => 'Flights + 4-Star Hotel + Schengen Visa',
                'duration_days' => 7,
                'duration_nights' => 6,
                'total_price' => 1400,
                'is_active' => true,
                'is_featured' => true,
                'flight_name' => 'Air France AF328',
                'hotel_name' => 'Le Marais Boutique Hotel',
                'hotel_star_rating' => 4,
                'visa_name' => 'Schengen Visa',
                'is_visa' => true,
                'transport_name' => null,
                'transport_type' => null,
                'is_transport' => false,
                'rating' => 4.7,
            ],

            // 3. Bali Tropical - Hotel + Transport + Visa
            [
                'name' => 'Bali Tropical Paradise',
                'type' => 'Hotel',
                'description' => 'Relax in Bali with beachside resort and local transport included',
                'sub_description' => '5-Star Resort + Airport Transport + Visa on Arrival',
                'duration_days' => 6,
                'duration_nights' => 5,
                'total_price' => 720,
                'is_active' => true,
                'is_featured' => true,
                'flight_name' => 'Garuda Indonesia GA632',
                'hotel_name' => 'Seminyak Beach Resort',
                'hotel_star_rating' => 5,
                'visa_name' => 'Indonesia VOA',
                'is_visa' => true,
                'transport_name' => 'Luxury Coach',
                'transport_type' => 'Bus',
                'is_transport' => true,
                'rating' => 4.6,
            ],

            // 4. Singapore Tech Hub - Flight + Hotel + Transport
            [
                'name' => 'Singapore Modern City',
                'type' => 'Flight',
                'description' => 'Discover Singapore with business-class hotels and premium transport',
                'sub_description' => 'Flights + 4-Star Hotel + Airport Shuttle Service',
                'duration_days' => 4,
                'duration_nights' => 3,
                'total_price' => 600,
                'is_active' => true,
                'is_featured' => false,
                'flight_name' => 'Singapore Airlines SQ405',
                'hotel_name' => 'Marina Bay Sands',
                'hotel_star_rating' => 5,
                'visa_name' => null,
                'is_visa' => false,
                'transport_name' => 'Airport Limousine',
                'transport_type' => 'Car',
                'is_transport' => true,
                'rating' => 4.9,
            ],

            // 5. Tokyo Adventure - Flight + Hotel + Visa + Transport
            [
                'name' => 'Tokyo Cultural Journey',
                'type' => 'Package',
                'description' => 'Complete Tokyo experience with flights, hotels, visa and local transport',
                'sub_description' => 'Flights + 3-Star Hotel + Japan Visa + Train Pass',
                'duration_days' => 8,
                'duration_nights' => 7,
                'total_price' => 1050,
                'is_active' => true,
                'is_featured' => true,
                'flight_name' => 'Japan Airlines JL777',
                'hotel_name' => 'Shinjuku Business Hotel',
                'hotel_star_rating' => 3,
                'visa_name' => 'Japan Tourist Visa',
                'is_visa' => true,
                'transport_name' => 'JR Rail Pass',
                'transport_type' => 'Train',
                'is_transport' => true,
                'rating' => 4.7,
            ],

            // 6. London Heritage - Hotel + Visa
            [
                'name' => 'London Royal Heritage',
                'type' => 'Visa',
                'description' => 'Explore London history with luxury hotels and UK visa support',
                'sub_description' => '4-Star Hotel + UK Visitor Visa',
                'duration_days' => 5,
                'duration_nights' => 4,
                'total_price' => 950,
                'is_active' => true,
                'is_featured' => false,
                'flight_name' => 'British Airways BA112',
                'hotel_name' => 'The Savoy London',
                'hotel_star_rating' => 5,
                'visa_name' => 'UK Visitor Visa',
                'is_visa' => true,
                'transport_name' => null,
                'transport_type' => null,
                'is_transport' => false,
                'rating' => 4.8,
            ],

            // 7. New York Adventure - Flight + Hotel + Transport
            [
                'name' => 'New York City Adventure',
                'type' => 'Transportation',
                'description' => 'Experience NYC with luxury hotels and comprehensive city transport',
                'sub_description' => 'Flights + 4-Star Hotel + NYC Metro Pass',
                'duration_days' => 6,
                'duration_nights' => 5,
                'total_price' => 1200,
                'is_active' => true,
                'is_featured' => false,
                'flight_name' => 'United Airlines UA101',
                'hotel_name' => 'The Plaza Hotel',
                'hotel_star_rating' => 5,
                'visa_name' => 'USA Tourist Visa',
                'is_visa' => false,
                'transport_name' => 'NYC Metro Pass',
                'transport_type' => 'Train',
                'is_transport' => true,
                'rating' => 4.6,
            ],

            // 8. Thailand Beach - Hotel + Transport + Visa
            [
                'name' => 'Thailand Beach Escape',
                'type' => 'Hotel',
                'description' => 'Relax in Thailand with beachfront hotels and local transport',
                'sub_description' => '4-Star Beach Resort + Speedboat Tours + Visa on Arrival',
                'duration_days' => 7,
                'duration_nights' => 6,
                'total_price' => 650,
                'is_active' => true,
                'is_featured' => true,
                'flight_name' => 'Thai Airways TG601',
                'hotel_name' => 'Phuket Beachfront Resort',
                'hotel_star_rating' => 4,
                'visa_name' => 'Thailand VOA',
                'is_visa' => true,
                'transport_name' => 'Speedboat Tours',
                'transport_type' => 'Boat',
                'is_transport' => true,
                'rating' => 4.5,
            ],

            // 9. Switzerland Luxury - Flight + Hotel + Visa
            [
                'name' => 'Swiss Alps Luxury',
                'type' => 'Hotel',
                'description' => 'Alpine experience in Switzerland with luxury chalets and visa',
                'sub_description' => 'Flights + Luxury Chalet + Schengen Visa',
                'duration_days' => 5,
                'duration_nights' => 4,
                'total_price' => 1500,
                'is_active' => true,
                'is_featured' => false,
                'flight_name' => 'SWISS LX180',
                'hotel_name' => 'Interlaken Alpine Resort',
                'hotel_star_rating' => 5,
                'visa_name' => 'Schengen Visa',
                'is_visa' => true,
                'transport_name' => null,
                'transport_type' => null,
                'is_transport' => false,
                'rating' => 4.9,
            ],

            // 10. Australia Outback - Complete Package
            [
                'name' => 'Australia Outback Explorer',
                'type' => 'Package',
                'description' => 'Complete Australian experience with flights, hotels, visa and tours',
                'sub_description' => 'Flights + 4-Star Hotel + Australia Visa + Outback Tours',
                'duration_days' => 10,
                'duration_nights' => 9,
                'total_price' => 1650,
                'is_active' => true,
                'is_featured' => true,
                'flight_name' => 'Qantas QF1',
                'hotel_name' => 'Sydney Opera Hotel',
                'hotel_star_rating' => 5,
                'visa_name' => 'Australia Tourist Visa',
                'is_visa' => true,
                'transport_name' => 'Luxury Coach Tour',
                'transport_type' => 'Bus',
                'is_transport' => true,
                'rating' => 4.8,
            ],
        ];

        foreach ($offers as $offer) {
            SpecialOffer::firstOrCreate(
                ['name' => $offer['name']],
                $offer
            );
        }
    }
}
