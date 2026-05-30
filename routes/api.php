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

// Public auth endpoints (no authentication required)
Route::post('auth/login', [AuthController::class, 'login'])->name('auth.login');

// Agency Services endpoints (accessible from web session)
Route::post('users/{userId}/services', [AgencyServiceController::class, 'store'])->name('agency-services.store');
Route::get('users/{userId}/services', [AgencyServiceController::class, 'index'])->name('agency-services.index');
Route::delete('users/{userId}/services/{serviceId}', [AgencyServiceController::class, 'destroy'])->name('agency-services.destroy');

// Public endpoints (no authentication required, but will use auth if token provided)
Route::get('special-offers', [SpecialOfferController::class, 'index'])->name('special-offers.index');
Route::get('hero-images', [HeroImageController::class, 'index'])->name('hero-images.index');
Route::get('testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');

// Public contact info endpoint
Route::get('contact-info', [ContactInfoController::class, 'index'])->name('contact-info.index');

// Protected API endpoints (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout'])->name('auth.logout');

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

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
});
