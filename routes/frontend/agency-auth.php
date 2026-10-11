<?php

use App\Http\Controllers\Agency\AgencyAuthController;
use App\Http\Controllers\Client\ClientPortalController;
use App\Http\Middleware\EnsureClientOnOwnDomain;
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

// The signed-in client's pages — only on the domain of the client's own agency
Route::middleware(EnsureClientOnOwnDomain::class)->prefix('client')->group(function () {
    Route::get('profile', [ClientPortalController::class, 'profile'])->name('client.profile');
    Route::get('bookings', [ClientPortalController::class, 'bookings'])->name('client.bookings');
    Route::get('invoices', [ClientPortalController::class, 'invoices'])->name('client.invoices');
    Route::get('invoices/{uid}', [ClientPortalController::class, 'invoice'])->name('client.invoices.show');
    Route::post('logout', [ClientPortalController::class, 'logout'])->name('client.logout');
});
