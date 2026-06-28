<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Web\AgencyController;
use App\Http\Controllers\Web\AgencyServiceController;
use App\Http\Controllers\Web\VisaController;
use App\Http\Controllers\SearchController;

// Landing/Public routes
Route::inertia('/', 'home')->name('home');
Route::inertia('/flights', 'frontend/flight/flight')->name('flights');
Route::inertia('/flights/results', 'FlightResults')->name('flights.results');
Route::inertia('/hotels', 'frontend/hotel/hotels')->name('hotels');
Route::inertia('/visas', 'frontend/visa/visas')->name('visas');

// Search results routes - Accept both GET and POST
Route::match(['get', 'post'], '/search/flight', [SearchController::class, 'flightSearch'])->name('search.flight');
Route::match(['get', 'post'], '/search/hotel', [SearchController::class, 'hotelSearch'])->name('search.hotel');
Route::match(['get', 'post'], '/search/visa', [SearchController::class, 'visaSearch'])->name('search.visa');
Route::inertia('/tours/{id}', 'TourDetail')->name('tours.show');
Route::inertia('/tours', 'tours')->name('tours');
Route::inertia('/tickets', 'tickets')->name('tickets');
Route::inertia('/visa-services', 'visa-services')->name('visa-services');
Route::get('/visa/{visa}', [VisaController::class, 'show'])->name('visa.show');
Route::inertia('/other-services', 'other-services')->name('other-services');
Route::inertia('/about-us', 'about-us')->name('about-us');
Route::inertia('/contact-us', 'contact-us')->name('contact-us');

// Web routes (frontend pages - authentication handled via API calls, not server-side)
// Dashboard
Route::inertia('dashboard', 'dashboard')->name('dashboard');

// Admin Routes (requires authentication - supports both session and token auth via custom middleware)
Route::middleware([\App\Http\Middleware\AuthenticateApiToken::class])->prefix('admin')->group(function () {
    // Tours Management (React Components via Inertia)
    Route::inertia('tours', 'Admin/Tour/Index')->name('admin.tours.index');
    Route::inertia('tours/create', 'Admin/Tour/Create')->name('admin.tours.create');
    Route::inertia('tours/{tour}/edit', 'Admin/Tour/Edit')->name('admin.tours.edit');

    // Bookings Management (Inertia Pages)
    Route::inertia('bookings', 'Admin/Bookings/Index')->name('admin.bookings.index');
    Route::inertia('bookings/{uid}', 'Admin/Bookings/Show')->name('admin.bookings.show');

    // Special Offer Management (Inertia Page)
    Route::inertia('special-offer', 'Admin/SpecialOffer/Index')->name('admin.special-offer.index');

    // Hero Image Management (Inertia Page)
    Route::inertia('hero-image', 'Admin/HeroImage/Index')->name('admin.hero-image.index');

    // Testimonial Management (Inertia Page)
    Route::inertia('testimonial', 'Admin/Testimonial/Index')->name('admin.testimonial.index');

    // Contact Info Management (Inertia Page)
    Route::inertia('contact-info', 'Admin/ContactInfo/Index')->name('admin.contact-info.index');

    // Visa Services Management (React Components via Inertia)
    Route::inertia('visa-services', 'Admin/Visa/Index')->name('admin.visa-services.index');

    // Services Management (React Components via Inertia)
    Route::inertia('services', 'Admin/Services/Index')->name('admin.services.index');

    // Packages Management (React Components via Inertia)
    Route::inertia('packages', 'Admin/Packages/Index')->name('admin.packages.index');
});

// Agency routes (frontend pages only)
Route::inertia('agency', 'agency/index')->name('agency.index');
Route::inertia('agency/create', 'agency/create')->name('agency.create');
Route::get('agency/{agency}', [AgencyController::class, 'show'])->name('agency.show');
Route::get('agency/{agency}/edit', [AgencyController::class, 'edit'])->name('agency.edit');

require __DIR__.'/settings.php';
