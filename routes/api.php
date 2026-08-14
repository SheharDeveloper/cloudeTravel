<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\Agency\AgencyController;
use App\Http\Controllers\Api\AgencyDocument\AgencyDocumentController;
use App\Http\Controllers\Api\Document\DocumentController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\AgencyServiceController;
use App\Http\Controllers\Api\SpecialOfferController;
use App\Http\Controllers\Api\HeroImageController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\ContactInfoController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\BookingNoteController;
use App\Http\Controllers\Api\VisaController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContactRequestController;
use App\Http\Controllers\Api\ContactReplyController;
use App\Http\Controllers\Admin\SettingsController;

// Public auth endpoints (no authentication required)
Route::post('auth/login', [AuthController::class, 'login'])->name('auth.login');

// Agency Services endpoints
Route::post('agencies/{agencyId}/services', [AgencyServiceController::class, 'store'])->name('agency-services.store');
Route::get('agencies/{agencyId}/services', [AgencyServiceController::class, 'index'])->name('agency-services.index');
Route::delete('agencies/{agencyId}/services/{serviceId}', [AgencyServiceController::class, 'destroy'])->name('agency-services.destroy');

// Public endpoints (no authentication required, but will use auth if token provided)
Route::get('special-offers', [SpecialOfferController::class, 'index'])->name('special-offers.index');
Route::get('special-offers-detail/{uid}', [SpecialOfferController::class, 'showByUid'])->name('special-offers.show-by-uid');
Route::get('hero-images', [HeroImageController::class, 'index'])->name('hero-images.index');
Route::get('testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');

// Public contact info endpoint
Route::get('contact-info', [ContactInfoController::class, 'index'])->name('contact-info.index');

// Public documents endpoint
Route::get('public-documents', [\App\Http\Controllers\Api\PublicDocumentController::class, 'index'])->name('public-documents.index');

// Public document display/download endpoint
Route::get('documents/{filename}', [\App\Http\Controllers\DocumentDisplayController::class, 'show'])->name('documents.show');

// Public contact form endpoint
Route::post('contact', [ContactController::class, 'store'])->name('contact.store');

// Public visa endpoints (no authentication required)
Route::get('visas', [VisaController::class, 'index'])->name('visas.index');
Route::get('visas/{visa}', [VisaController::class, 'show'])->name('visas.show');

// Public package endpoints (no authentication required)
Route::get('packages', [PackageController::class, 'index'])->name('packages.index');
Route::get('packages/{package}', [PackageController::class, 'show'])->name('packages.show');

// Public booking submit endpoint (no authentication required - for booking modal)
Route::post('bookings', [BookingController::class, 'store'])->name('bookings.store');

// Public travel quote feedback endpoint (no authentication required)
Route::post('travel-quote-feedback', [\App\Http\Controllers\Api\TravelQuoteFeedbackController::class, 'store'])->name('travel-quote-feedback.store');

// Protected API endpoints (authentication required - using session auth via Breeze/Fortify)
// Need 'web' middleware to load session for authentication
Route::middleware(['web', 'auth:web,agency'])->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout'])->name('auth.logout');

    // Agency endpoints
    Route::post('agencies', [AgencyController::class, 'store'])->name('agencies.store');
    Route::get('agencies', [AgencyController::class, 'index'])->name('agencies.index');
    Route::get('agencies/{agency}', [AgencyController::class, 'show'])->name('agencies.show');
    Route::patch('agencies/{agency}', [AgencyController::class, 'update'])->name('agencies.update');
    Route::delete('agencies/{agency}', [AgencyController::class, 'destroy'])->name('agencies.destroy');

    // Agency Documents endpoints
    Route::post('agency-documents', [AgencyDocumentController::class, 'store'])->name('agency-documents.store');
    Route::get('agency-documents', [AgencyDocumentController::class, 'index'])->name('agency-documents.index');
    Route::get('agency-documents/{agencyDocument}', [AgencyDocumentController::class, 'show'])->name('agency-documents.show');
    Route::patch('agency-documents/{agencyDocument}', [AgencyDocumentController::class, 'update'])->name('agency-documents.update');
    Route::delete('agency-documents/{agencyDocument}', [AgencyDocumentController::class, 'destroy'])->name('agency-documents.destroy');

    // Documents endpoints
    Route::post('documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::get('documents/{document}', [DocumentController::class, 'show'])->name('documents.show');
    Route::patch('documents/{document}', [DocumentController::class, 'update'])->name('documents.update');
    Route::delete('documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    // User endpoints
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::patch('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Special Offer resource routes (create, update, delete)
    Route::resource('special-offers', SpecialOfferController::class)->except(['index', 'show']);

    // Hero Image resource routes (create, update, delete)
    Route::resource('hero-images', HeroImageController::class)->except(['index', 'show']);

    // Testimonials resource routes (create, update, delete)
    Route::resource('testimonials', TestimonialController::class)->except(['index', 'show']);

    // Contact Info routes (create/update)
    Route::post('contact-info', [ContactInfoController::class, 'store'])->name('contact-info.store');
    Route::put('contact-info', [ContactInfoController::class, 'update'])->name('contact-info.update');

    // Visa resource routes (create, update, delete)
    Route::post('visas', [VisaController::class, 'store'])->name('visas.store');
    Route::put('visas/{visa}', [VisaController::class, 'update'])->name('visas.update');
    Route::patch('visas/{visa}', [VisaController::class, 'update'])->name('visas.update');
    Route::delete('visas/{visa}', [VisaController::class, 'destroy'])->name('visas.destroy');

    // Package resource routes (create, update, delete)
    Route::post('packages', [PackageController::class, 'store'])->name('packages.store');
    Route::put('packages/{package}', [PackageController::class, 'update'])->name('packages.update');
    Route::patch('packages/{package}', [PackageController::class, 'update'])->name('packages.update');
    Route::delete('packages/{package}', [PackageController::class, 'destroy'])->name('packages.destroy');

    // Protected booking endpoints (authentication required - for admin)
    Route::get('bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::patch('bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');

    // Booking Notes endpoints (authentication required - for admin)
    Route::get('bookings/{booking}/notes', [BookingNoteController::class, 'index'])->name('booking-notes.index');
    Route::post('bookings/{booking}/notes', [BookingNoteController::class, 'store'])->name('booking-notes.store');
    Route::delete('bookings/{booking}/notes/{note}', [BookingNoteController::class, 'destroy'])->name('booking-notes.destroy');

    // Contact Requests endpoints (authentication required - for admin)
    Route::get('contact-requests', [ContactRequestController::class, 'index'])->name('contact-requests.index');
    Route::get('contact-requests/{contact}', [ContactRequestController::class, 'show'])->name('contact-requests.show');
    Route::delete('contact-requests/{contact}', [ContactRequestController::class, 'destroy'])->name('contact-requests.destroy');
    Route::post('contact-requests/{contact}/reply', [ContactReplyController::class, 'send'])->name('contact-requests.reply');

    // Settings endpoints (authentication required - for admin)
    Route::get('settings', [SettingsController::class, 'getSettings'])->name('settings.get');
    Route::put('settings', [SettingsController::class, 'updateSettings'])->name('settings.update');

    // Travel Quote API endpoints (authentication required - for admin)
    Route::delete('travel-quote/{id}', [\App\Http\Controllers\Admin\TravelQuoteController::class, 'destroy'])->name('travel-quote.destroy');

    // Travel Quote Feedback update endpoint (authentication required - for admin)
    Route::put('travel-quote-feedback/{id}', [\App\Http\Controllers\Api\TravelQuoteFeedbackController::class, 'update'])->name('travel-quote-feedback.update');
});
