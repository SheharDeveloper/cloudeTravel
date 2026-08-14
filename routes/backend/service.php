<?php

use Illuminate\Support\Facades\Route;

// Services Management (React Components via Inertia)
Route::inertia('services', 'Admin/Services/Index')->name('admin.services.index');
