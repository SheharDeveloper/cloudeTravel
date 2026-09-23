<?php

use Illuminate\Support\Facades\Route;

// Country Management (global reference table — superadmin only)
Route::get('countries', [\App\Http\Controllers\Admin\CountryController::class, 'index'])->name('admin.country.index');
Route::post('countries/default-country', [\App\Http\Controllers\Admin\CountryController::class, 'updateDefaultCountry'])->name('admin.country.default-country');
Route::post('countries', [\App\Http\Controllers\Admin\CountryController::class, 'store'])->name('admin.country.store');
Route::put('countries/{country}', [\App\Http\Controllers\Admin\CountryController::class, 'update'])->name('admin.country.update');
Route::delete('countries/{country}', [\App\Http\Controllers\Admin\CountryController::class, 'destroy'])->name('admin.country.destroy');
