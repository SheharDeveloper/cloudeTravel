<?php

use Illuminate\Support\Facades\Route;

// Tours Management (React Components via Inertia)
Route::inertia('tours', 'Admin/Tour/Index')->name('admin.tours.index');
Route::inertia('tours/create', 'Admin/Tour/Create')->name('admin.tours.create');
Route::inertia('tours/{tour}/edit', 'Admin/Tour/Edit')->name('admin.tours.edit');
