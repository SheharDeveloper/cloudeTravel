<?php

use App\Http\Controllers\Admin\PackageController;
use Illuminate\Support\Facades\Route;

// Packages Management (Inertia): the list, add, edit (POST with _method=PUT, for the image) and delete
Route::get('packages', [PackageController::class, 'index'])->name('admin.packages.index');
Route::post('packages', [PackageController::class, 'store'])->name('admin.packages.store');
Route::put('packages/{package}', [PackageController::class, 'update'])->name('admin.packages.update');
Route::delete('packages/{package}', [PackageController::class, 'destroy'])->name('admin.packages.destroy');
