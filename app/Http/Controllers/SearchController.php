<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function flightSearch(Request $request)
    {
        $validated = $request->validate([
            'tripType' => 'required|string',
            'fromCity' => 'required|string',
            'toCity' => 'required|string',
            'departureDate' => 'required|date',
            'adults' => 'required|integer',
            'children' => 'required|integer',
            'infants' => 'required|integer',
            'selectedClass' => 'required|string',
        ]);

        $flightResults = [
            ['id' => 1, 'airline' => 'Air India', 'departure' => '08:00', 'arrival' => '12:30', 'duration' => '4h 30m', 'price' => 5999, 'stops' => 0],
            ['id' => 2, 'airline' => 'IndiGo', 'departure' => '10:30', 'arrival' => '14:45', 'duration' => '4h 15m', 'price' => 4999, 'stops' => 0],
            ['id' => 3, 'airline' => 'SpiceJet', 'departure' => '14:00', 'arrival' => '18:20', 'duration' => '4h 20m', 'price' => 3999, 'stops' => 1],
            ['id' => 4, 'airline' => 'Vistara', 'departure' => '16:15', 'arrival' => '20:45', 'duration' => '4h 30m', 'price' => 6499, 'stops' => 0],
        ];

        return Inertia::render('frontend/flight/flight-results', [
            'searchParams' => $validated,
            'results' => $flightResults,
        ]);
    }

    public function hotelSearch(Request $request)
    {
        $validated = $request->validate([
            'city' => 'required|string',
            'checkInDate' => 'required|date',
            'checkOutDate' => 'required|date',
            'rooms' => 'required|integer',
            'guests' => 'required|integer',
        ]);

        $hotelResults = [
            ['id' => 1, 'name' => 'Taj Hotel', 'rating' => 5, 'reviews' => 1240, 'price' => 8999, 'image' => '/images/dummy.jpg', 'amenities' => ['WiFi', 'Pool', 'Gym']],
            ['id' => 2, 'name' => 'ITC Grand', 'rating' => 4.5, 'reviews' => 890, 'price' => 7499, 'image' => '/images/dummy.jpg', 'amenities' => ['WiFi', 'Restaurant']],
            ['id' => 3, 'name' => 'Radisson Blu', 'rating' => 4, 'reviews' => 650, 'price' => 5999, 'image' => '/images/dummy.jpg', 'amenities' => ['WiFi', 'Spa']],
            ['id' => 4, 'name' => 'Hyatt Regency', 'rating' => 4.8, 'reviews' => 1100, 'price' => 9499, 'image' => '/images/dummy.jpg', 'amenities' => ['WiFi', 'Pool', 'Gym', 'Spa']],
        ];

        return Inertia::render('frontend/hotel/hotel-results', [
            'searchParams' => $validated,
            'results' => $hotelResults,
        ]);
    }

    public function visaSearch(Request $request)
    {
        $validated = $request->validate([
            'passportCountry' => 'required|string',
            'destination' => 'required|string',
            'travelDate' => 'required|date',
        ]);

        $visaResults = [
            ['id' => 1, 'visaType' => 'Tourist Visa', 'duration' => '3-5 days', 'validity' => '6 months', 'price' => 2999, 'documents' => ['Passport', 'Photos', 'Application']],
            ['id' => 2, 'visaType' => 'Business Visa', 'duration' => '5-7 days', 'validity' => '1 year', 'price' => 4999, 'documents' => ['Passport', 'Business Letter', 'Photos']],
            ['id' => 3, 'visaType' => 'Express Visa', 'duration' => '24 hours', 'validity' => '3 months', 'price' => 6999, 'documents' => ['Passport', 'Photos']],
        ];

        return Inertia::render('frontend/visa/visa-results', [
            'searchParams' => $validated,
            'results' => $visaResults,
        ]);
    }
}
