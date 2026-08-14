<?php

use Illuminate\Support\Facades\Route;

// Agency auth routes first: 'agency/login' must beat the 'agency/{agency}' wildcard
require __DIR__.'/frontend/agency-auth.php';

// Frontend Routes
require __DIR__.'/frontend/web.php';

// Admin Routes (requires authentication via session - Breeze/Inertia)
// Shared with agencies: an agency manages its own staff and roles.
Route::middleware('auth:web,agency')->prefix('admin')->group(function () {
    require __DIR__.'/backend/staff.php';
    require __DIR__.'/backend/role.php';
});

Route::middleware('auth')->prefix('admin')->group(function () {
    // Backend Routes
    require __DIR__.'/backend/agency.php';
    require __DIR__.'/backend/travel-quote.php';
    require __DIR__.'/backend/document.php';
    require __DIR__.'/backend/tour.php';
    require __DIR__.'/backend/booking.php';
    require __DIR__.'/backend/contact-request.php';
    require __DIR__.'/backend/special-offer.php';
    require __DIR__.'/backend/hero-image.php';
    require __DIR__.'/backend/testimonial.php';
    require __DIR__.'/backend/contact-info.php';
    require __DIR__.'/backend/visa-service.php';
    require __DIR__.'/backend/service.php';
    require __DIR__.'/backend/package.php';

    // Settings Management
    Route::inertia('settings', 'Admin/Settings/Index')->name('admin.settings.index');
});

// Settings Routes (authenticated users)
require __DIR__.'/settings.php';
