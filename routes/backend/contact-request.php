<?php

use Illuminate\Support\Facades\Route;

// Contact Requests Management (Inertia Pages)
Route::inertia('contact-requests', 'Admin/ContactRequests/Index')->name('admin.contact-requests.index');
Route::get('contact-requests/{contact:uid}', [\App\Http\Controllers\Admin\ContactRequestShowController::class, 'show'])->name('admin.contact-requests.show');
