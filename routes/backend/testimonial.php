<?php

use Illuminate\Support\Facades\Route;

// Testimonial Management
Route::get('testimonial', [\App\Http\Controllers\Admin\TestimonialController::class, 'index'])->name('admin.testimonial.index');
Route::put('testimonial/toggle-review', [\App\Http\Controllers\Admin\TestimonialController::class, 'toggleReview'])->name('admin.testimonial.toggle-review');
