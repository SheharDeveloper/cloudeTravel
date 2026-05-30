<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Testimonial::create([
            'client_name' => 'Sarah Johnson',
            'client_image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
            'message' => 'CloudTravel made my vacation booking so easy! From flights to hotels, everything was seamless. Highly recommended!',
            'rating' => 5,
            'status' => 1,
            'order' => 1,
        ]);

        Testimonial::create([
            'client_name' => 'Michael Chen',
            'client_image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
            'message' => 'The best travel booking platform I\'ve used. Great prices and excellent customer support throughout my journey.',
            'rating' => 5,
            'status' => 1,
            'order' => 2,
        ]);

        Testimonial::create([
            'client_name' => 'Emma Wilson',
            'client_image' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
            'message' => 'Visa processing through CloudTravel was incredibly fast. I got my travel documents in just 2 weeks!',
            'rating' => 5,
            'status' => 1,
            'order' => 3,
        ]);

        Testimonial::create([
            'client_name' => 'James Rodriguez',
            'client_image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
            'message' => 'CloudTravel offers unbeatable prices on flights and hotels. Their customer service is always ready to help!',
            'rating' => 5,
            'status' => 1,
            'order' => 4,
        ]);

        Testimonial::create([
            'client_name' => 'Lisa Anderson',
            'client_image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
            'message' => 'My family had an amazing trip thanks to CloudTravel\'s comprehensive travel packages and 24/7 support!',
            'rating' => 5,
            'status' => 1,
            'order' => 5,
        ]);
    }
}
