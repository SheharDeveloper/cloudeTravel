<?php

use Illuminate\Support\Facades\Route;

// Packages Management (React Components via Inertia)
Route::inertia('packages', 'Admin/Packages/Index')->name('admin.packages.index');
