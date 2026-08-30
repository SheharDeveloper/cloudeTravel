<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AgencyController;
use App\Http\Controllers\Web\VisaController;
use App\Http\Controllers\Web\PackageController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Web\OfferController;
use App\Http\Controllers\PublicQuotePreviewController;
use App\Http\Controllers\QuoteFeedbackController;

// Landing/Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Public pages
Route::inertia('/all-offers', 'AllOffers', ['currency' => config('currency')])->name('all-offers');
Route::inertia('/flights', 'frontend/flight/flight')->name('flights');
Route::inertia('/flights/results', 'FlightResults')->name('flights.results');
Route::inertia('/hotels', 'frontend/hotel/hotels')->name('hotels');
Route::inertia('/visas', 'frontend/visa/visas')->name('visas');
Route::inertia('/tours/{id}', 'TourDetail')->name('tours.show');
Route::inertia('/tours', 'tours')->name('tours');
Route::inertia('/tickets', 'tickets')->name('tickets');
Route::inertia('/visa-services', 'visa-services')->name('visa-services');
Route::inertia('/other-services', 'other-services')->name('other-services');
Route::inertia('/about-us', 'about-us')->name('about-us');
Route::inertia('/contact-us', 'contact-us')->name('contact-us');

// Offers
Route::get('/offers/{uid}', [OfferController::class, 'show'])->name('offers.detail');

// Quote Preview
Route::get('/quote/preview/{uid}', [PublicQuotePreviewController::class, '__invoke'])->name('quote.preview');
Route::post('/quote/feedback/submit', [QuoteFeedbackController::class, 'submit'])->name('quote.feedback.submit');

// Search
Route::match(['get', 'post'], '/search/flight', [SearchController::class, 'flightSearch'])->name('search.flight');
Route::match(['get', 'post'], '/search/hotel', [SearchController::class, 'hotelSearch'])->name('search.hotel');
Route::match(['get', 'post'], '/search/visa', [SearchController::class, 'visaSearch'])->name('search.visa');

// Visa
Route::get('/visa/{visa}', [VisaController::class, 'show'])->name('visa.show');

// Packages
Route::get('/packages/{package}', [PackageController::class, 'show'])->name('packages.show');

// Dashboard - accepts either an admin (web) or an agency session
Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware('auth:web,agency')
    ->name('dashboard');

// Attendance gate for staff (superadmin-side User or agency-side AgencyUser).
// Marked from a blocking modal shown over whatever page they're already on
// (see 'attendancePending' shared prop + AttendanceGate component), not a
// separate page, so there's no GET route here.
Route::post('attendance/mark', [\App\Http\Controllers\AttendanceController::class, 'store'])
    ->middleware('auth:web,agency')
    ->name('attendance.mark.store');

// Profile Settings (authenticated users)
Route::middleware('auth:web,agency')->get('profile', fn() => inertia('ProfileSettings'))->name('profile');
Route::middleware('auth:web,agency')->put('profile', [App\Http\Controllers\Settings\ProfileController::class, 'updateFromProfile'])->name('profile.update.put');
Route::middleware('auth:web,agency')->post('profile-upload', [App\Http\Controllers\Settings\ProfileController::class, 'uploadProfile'])->name('profile.upload');
Route::middleware('auth:web,agency')->put('password', [App\Http\Controllers\Settings\SecurityController::class, 'updatePassword'])->name('password.update.put');

// Agency routes (frontend pages only)
Route::inertia('agency', 'agency/index')->name('agency.index');
Route::inertia('agency/create', 'agency/create')->name('agency.create');
Route::get('agency/{agency}', [AgencyController::class, 'show'])->name('agency.show');
Route::get('agency/{agency}/edit', [AgencyController::class, 'edit'])->name('agency.edit');
