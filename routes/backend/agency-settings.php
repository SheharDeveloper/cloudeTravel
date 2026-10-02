<?php

use App\Http\Controllers\Admin\AgencySettingsController;
use Illuminate\Support\Facades\Route;

// The signed-in agency's own settings (commission per service). Agency owner only.
Route::get('agency-settings', [AgencySettingsController::class, 'index'])->name('admin.agency-settings.index');
Route::put('agency-settings', [AgencySettingsController::class, 'update'])->name('admin.agency-settings.update');
