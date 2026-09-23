<?php

use Illuminate\Support\Facades\Route;

Route::get('tax-setups', [\App\Http\Controllers\Admin\TaxSetupController::class, 'index'])->name('admin.tax-setups.index');
Route::post('tax-setups', [\App\Http\Controllers\Admin\TaxSetupController::class, 'store'])->name('admin.tax-setups.store');
Route::put('tax-setups/{taxSetup}', [\App\Http\Controllers\Admin\TaxSetupController::class, 'update'])->name('admin.tax-setups.update');
Route::delete('tax-setups/{taxSetup}', [\App\Http\Controllers\Admin\TaxSetupController::class, 'destroy'])->name('admin.tax-setups.destroy');
