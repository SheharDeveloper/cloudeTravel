<?php

use App\Http\Controllers\Admin\ServiceBookingController;
use Illuminate\Support\Facades\Route;

// Bookings made from the admin side (visa, flight…), with invoice numbers
Route::get('service-bookings', [ServiceBookingController::class, 'index'])->name('admin.service-bookings.index');
Route::get('service-bookings/{uid}', [ServiceBookingController::class, 'show'])->name('admin.service-bookings.show');
Route::get('visa-applications/{uid}', [ServiceBookingController::class, 'showApplication'])->name('admin.visa-applications.show');
Route::put('visa-applications/{uid}/form', [ServiceBookingController::class, 'saveApplicationForm'])->name('admin.visa-applications.form');
Route::post('visa-applications/{uid}/form/files', [ServiceBookingController::class, 'uploadFormFile'])->name('admin.visa-applications.form.upload');
Route::get('visa-applications/{uid}/form/file', [ServiceBookingController::class, 'downloadFormFile'])->name('admin.visa-applications.form.file');
Route::get('service-bookings/{uid}/edit', [ServiceBookingController::class, 'edit'])->name('admin.service-bookings.edit');
Route::put('service-bookings/{uid}', [ServiceBookingController::class, 'update'])->name('admin.service-bookings.update');
Route::post('service-bookings/{uid}/doc-sign', [ServiceBookingController::class, 'generateDocSign'])->name('admin.service-bookings.doc-sign');
Route::post('service-bookings/{uid}/doc-sign/resend', [ServiceBookingController::class, 'resendDocSign'])->name('admin.service-bookings.doc-sign.resend');
Route::put('service-bookings/{uid}/remark', [ServiceBookingController::class, 'updateRemark'])->name('admin.service-bookings.remark');
