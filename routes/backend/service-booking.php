<?php

use App\Http\Controllers\Admin\ApplicationDocumentController;
use App\Http\Controllers\Admin\ServiceBookingController;
use Illuminate\Support\Facades\Route;

// Bookings made from the admin side (visa, flight…), with invoice numbers
Route::get('service-bookings', [ServiceBookingController::class, 'index'])->name('admin.service-bookings.index');
Route::get('service-bookings/{uid}', [ServiceBookingController::class, 'show'])->name('admin.service-bookings.show');
// Superadmin: applications agencies have sent to the admin
Route::get('agency-applications', [ServiceBookingController::class, 'agencyApplications'])->name('admin.agency-applications.index');
Route::get('visa-applications/{uid}', [ServiceBookingController::class, 'showApplication'])->name('admin.visa-applications.show');
Route::put('visa-applications/{uid}/status', [ServiceBookingController::class, 'updateApplicationStatus'])->name('admin.visa-applications.status');
Route::post('visa-applications/{uid}/send-to-admin', [ServiceBookingController::class, 'sendToAdmin'])->name('admin.visa-applications.send');
Route::put('visa-applications/{uid}/form', [ServiceBookingController::class, 'saveApplicationForm'])->name('admin.visa-applications.form');
Route::post('visa-applications/{uid}/form/files', [ServiceBookingController::class, 'uploadFormFile'])->name('admin.visa-applications.form.upload');
Route::get('visa-applications/{uid}/form/file', [ServiceBookingController::class, 'downloadFormFile'])->name('admin.visa-applications.form.file');
// Upload Document: the superadmin requests documents, the agency uploads them
Route::put('visa-applications/{uid}/documents', [ApplicationDocumentController::class, 'update'])->name('admin.visa-applications.documents.update');
Route::post('visa-applications/{uid}/documents/{document}/upload', [ApplicationDocumentController::class, 'upload'])->whereNumber('document')->name('admin.visa-applications.documents.upload');
Route::post('visa-applications/{uid}/documents/{document}/review', [ApplicationDocumentController::class, 'review'])->whereNumber('document')->name('admin.visa-applications.documents.review');
Route::delete('visa-applications/{uid}/documents/{document}/file', [ApplicationDocumentController::class, 'removeFile'])->whereNumber('document')->name('admin.visa-applications.documents.remove-file');
Route::get('visa-applications/{uid}/documents/{document}/file', [ApplicationDocumentController::class, 'file'])->whereNumber('document')->name('admin.visa-applications.documents.file');
Route::get('service-bookings/{uid}/edit', [ServiceBookingController::class, 'edit'])->name('admin.service-bookings.edit');
Route::put('service-bookings/{uid}', [ServiceBookingController::class, 'update'])->name('admin.service-bookings.update');
Route::post('service-bookings/{uid}/doc-sign', [ServiceBookingController::class, 'generateDocSign'])->name('admin.service-bookings.doc-sign');
Route::post('service-bookings/{uid}/doc-sign/resend', [ServiceBookingController::class, 'resendDocSign'])->name('admin.service-bookings.doc-sign.resend');
Route::put('service-bookings/{uid}/remark', [ServiceBookingController::class, 'updateRemark'])->name('admin.service-bookings.remark');
