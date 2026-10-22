<?php

use App\Http\Controllers\Admin\ApplicationDocumentController;
use App\Http\Controllers\Admin\ServiceBookingController;
use Illuminate\Support\Facades\Route;

// Invoices: one per booking, from the agency (or superadmin) to its client
Route::get('invoices', [\App\Http\Controllers\Admin\InvoiceController::class, 'index'])->name('admin.invoices.index');
Route::get('invoices/refunded', [\App\Http\Controllers\Admin\InvoiceController::class, 'refunded'])->name('admin.invoices.refunded');
Route::get('invoices/export/{format}', [\App\Http\Controllers\Admin\InvoiceController::class, 'export'])->whereIn('format', ['xlsx', 'csv'])->name('admin.invoices.export');
Route::get('invoices/{uid}', [\App\Http\Controllers\Admin\InvoiceController::class, 'show'])->name('admin.invoices.show');
Route::get('invoices/{uid}/{mode}', [\App\Http\Controllers\Admin\InvoiceController::class, 'change'])->whereIn('mode', ['edit', 'amend'])->name('admin.invoices.change');
Route::post('invoices/{uid}/refund-display', [\App\Http\Controllers\Admin\InvoiceController::class, 'refundDisplay'])->name('admin.invoices.refund-display');
Route::post('invoices/{uid}/refund', [\App\Http\Controllers\Admin\InvoiceController::class, 'refund'])->name('admin.invoices.refund');
Route::post('invoices/{uid}/pay', [\App\Http\Controllers\Admin\InvoiceController::class, 'pay'])->name('admin.invoices.pay');
Route::post('invoices/{uid}/confirm-paper', [\App\Http\Controllers\Admin\InvoiceController::class, 'confirmPaper'])->name('admin.invoices.confirm-paper');

// Bookings made from the admin side (visa, flight…), with invoice numbers
Route::get('service-bookings', [ServiceBookingController::class, 'index'])->name('admin.service-bookings.index');
Route::get('service-bookings/{uid}', [ServiceBookingController::class, 'show'])->name('admin.service-bookings.show');
Route::get('service-bookings/{uid}/invoice', [ServiceBookingController::class, 'invoice'])->name('admin.service-bookings.invoice');
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
Route::post('service-bookings/{uid}/doc-sign/regenerate', [ServiceBookingController::class, 'regenerateDocSign'])->name('admin.service-bookings.doc-sign.regenerate');
Route::post('service-bookings/{uid}/doc-sign/resend', [ServiceBookingController::class, 'resendDocSign'])->name('admin.service-bookings.doc-sign.resend');
Route::put('service-bookings/{uid}/remark', [ServiceBookingController::class, 'updateRemark'])->name('admin.service-bookings.remark');
