<?php

use Illuminate\Support\Facades\Route;

// Bookings Management
Route::get('bookings', [\App\Http\Controllers\Admin\BookingController::class, 'index'])->name('admin.bookings.index');
Route::inertia('bookings/{uid}', 'Admin/Bookings/Show')->name('admin.bookings.show');
