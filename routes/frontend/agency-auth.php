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
    // Profile Settings: edit the profile and change the password, on one page
    Route::get('settings', [ClientPortalController::class, 'settings'])->name('client.settings');
    Route::put('profile', [ClientPortalController::class, 'updateProfile'])->name('client.profile.update');
    Route::put('password', [ClientPortalController::class, 'updatePassword'])->name('client.password.update');
    Route::get('bookings', [ClientPortalController::class, 'bookings'])->name('client.bookings');
    // View Application: fill the form and upload the requested documents
    Route::get('applications/{uid}', [ClientPortalController::class, 'application'])->name('client.applications.show');
    Route::put('applications/{uid}/form', [ClientPortalController::class, 'saveApplicationForm'])->name('client.applications.form');
    Route::post('applications/{uid}/form/files', [ClientPortalController::class, 'uploadApplicationFormFile'])->name('client.applications.form.upload');
    Route::get('applications/{uid}/form/file', [ClientPortalController::class, 'applicationFormFile'])->name('client.applications.form.file');
    Route::post('applications/{uid}/documents/{document}/upload', [ClientPortalController::class, 'uploadApplicationDocument'])->whereNumber('document')->name('client.applications.documents.upload');
    Route::get('applications/{uid}/documents/{document}/file', [ClientPortalController::class, 'applicationDocumentFile'])->whereNumber('document')->name('client.applications.documents.file');
    Route::get('invoices', [ClientPortalController::class, 'invoices'])->name('client.invoices');
    // My Documents: the documents the agency received from the client, and returned
    Route::get('documents', [ClientPortalController::class, 'documents'])->name('client.documents');
    Route::get('invoices/{uid}', [ClientPortalController::class, 'invoice'])->name('client.invoices.show');
    Route::post('logout', [ClientPortalController::class, 'logout'])->name('client.logout');
});
