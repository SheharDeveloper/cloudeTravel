<?php

use App\Http\Controllers\Agency\AgencyAuthController;
use Illuminate\Support\Facades\Route;

// Agency authentication (agency resolved from the registered domain).
// No `guest` middleware here: it redirects to the admin HOME (/dashboard),
// which needs the web guard and bounces straight back to /login.
Route::get('agency/login', [AgencyAuthController::class, 'showLogin'])->name('agency.login');
Route::post('agency/login', [AgencyAuthController::class, 'login'])->name('agency.login.store');

Route::get('agency/client-login', [AgencyAuthController::class, 'showClientLogin'])->name('agency.client-login');
Route::post('agency/client-login', [AgencyAuthController::class, 'clientLogin'])->name('agency.client-login.store');

Route::post('agency/logout', [AgencyAuthController::class, 'logout'])
    ->middleware('auth:agency')
    ->name('agency.logout');
