<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Web\AgencyController;
use App\Http\Controllers\Web\AgencyServiceController;

// Landing/Public routes
Route::inertia('/', 'home')->name('home');
Route::inertia('/tours', 'tours')->name('tours');
Route::inertia('/tickets', 'tickets')->name('tickets');
Route::inertia('/visa-services', 'visa-services')->name('visa-services');
Route::inertia('/other-services', 'other-services')->name('other-services');
Route::inertia('/about-us', 'about-us')->name('about-us');
Route::inertia('/contact-us', 'contact-us')->name('contact-us');

// Web routes (frontend pages - authentication handled via API calls, not server-side)
// Dashboard
Route::inertia('dashboard', 'dashboard')->name('dashboard');

// Admin Routes (frontend pages only - API calls handle auth)
Route::prefix('admin')->group(function () {
    // Tours Management
    Route::get('tours', [\App\Http\Controllers\Admin\TourController::class, 'index'])->name('admin.tours.index');
    Route::get('tours/create', [\App\Http\Controllers\Admin\TourController::class, 'create'])->name('admin.tours.create');
    Route::post('tours', [\App\Http\Controllers\Admin\TourController::class, 'store'])->name('admin.tours.store');
    Route::get('tours/{tour}/edit', [\App\Http\Controllers\Admin\TourController::class, 'edit'])->name('admin.tours.edit');
    Route::put('tours/{tour}', [\App\Http\Controllers\Admin\TourController::class, 'update'])->name('admin.tours.update');
    Route::delete('tours/{tour}', [\App\Http\Controllers\Admin\TourController::class, 'destroy'])->name('admin.tours.destroy');

    // Special Offer Management (Inertia Page)
    Route::inertia('special-offer', 'Admin/SpecialOffer/Index')->name('admin.special-offer.index');

    // Hero Image Management (Inertia Page)
    Route::inertia('hero-image', 'Admin/HeroImage/Index')->name('admin.hero-image.index');

    // Testimonial Management (Inertia Page)
    Route::inertia('testimonial', 'Admin/Testimonial/Index')->name('admin.testimonial.index');

    // Contact Info Management (Inertia Page)
    Route::inertia('contact-info', 'Admin/ContactInfo/Index')->name('admin.contact-info.index');
});

// Agency routes (frontend pages only)
Route::inertia('agency', 'agency/index')->name('agency.index');
Route::inertia('agency/create', 'agency/create')->name('agency.create');
Route::get('agency/{agency}', [AgencyController::class, 'show'])->name('agency.show');
Route::get('agency/{agency}/edit', [AgencyController::class, 'edit'])->name('agency.edit');

require __DIR__.'/settings.php';
