<?php

use Illuminate\Support\Facades\Route;

// Staff Management
Route::get('staff', [\App\Http\Controllers\Admin\StaffController::class, 'index'])->name('admin.staff.index');
Route::get('staff/create', [\App\Http\Controllers\Admin\StaffController::class, 'create'])->name('admin.staff.create');
Route::post('staff', [\App\Http\Controllers\Admin\StaffController::class, 'store'])->name('admin.staff.store');
Route::get('staff/{uid}', [\App\Http\Controllers\Admin\StaffController::class, 'show'])->name('admin.staff.show');
Route::get('staff/{uid}/edit', [\App\Http\Controllers\Admin\StaffController::class, 'edit'])->name('admin.staff.edit');
Route::put('staff/{uid}', [\App\Http\Controllers\Admin\StaffController::class, 'update'])->name('admin.staff.update');
Route::delete('staff/{uid}', [\App\Http\Controllers\Admin\StaffController::class, 'destroy'])->name('admin.staff.destroy');
Route::post('staff/{uid}/toggle-status', [\App\Http\Controllers\Admin\StaffController::class, 'toggleStatus'])->name('admin.staff.toggle-status');
Route::post('staff/{uid}/assign-role', [\App\Http\Controllers\Admin\StaffController::class, 'assignRole'])->name('admin.staff.assign-role');
Route::post('staff/{uid}/reset-password', [\App\Http\Controllers\Admin\StaffController::class, 'resetPassword'])->name('admin.staff.reset-password');
Route::post('staff/{uid}/impersonate', [\App\Http\Controllers\Admin\StaffController::class, 'impersonate'])->name('admin.staff.impersonate');
Route::post('staff-stop-impersonating', [\App\Http\Controllers\Admin\StaffController::class, 'stopImpersonating'])->name('admin.staff.stop-impersonating');
Route::post('staff/validate-step', [\App\Http\Controllers\Admin\StaffController::class, 'validateFormStep'])->name('admin.staff.validate-step');
Route::delete('staff-educations/{id}', [\App\Http\Controllers\Admin\StaffController::class, 'deleteEducation'])->name('admin.staff-educations.destroy');
Route::delete('staff-tax-deductions/{id}', [\App\Http\Controllers\Admin\StaffController::class, 'deleteTaxDeduction'])->name('admin.staff-tax-deductions.destroy');
Route::delete('staff-documents/{id}', [\App\Http\Controllers\Admin\StaffController::class, 'deleteDocument'])->name('admin.staff-documents.destroy');
