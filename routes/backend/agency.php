<?php

use Illuminate\Support\Facades\Route;

// Agency B2B Management
Route::get('agency-b2b', [\App\Http\Controllers\Admin\AgencyB2BController::class, 'index'])->name('admin.agency-b2b.index');
Route::get('agency-b2b/create', [\App\Http\Controllers\Admin\AgencyB2BController::class, 'create'])->name('admin.agency-b2b.create');
Route::post('agency-b2b', [\App\Http\Controllers\Admin\AgencyB2BController::class, 'store'])->name('admin.agency-b2b.store');
Route::get('agency-b2b/{uid}', [\App\Http\Controllers\Admin\AgencyB2BController::class, 'show'])->name('admin.agency-b2b.show');
Route::get('agency-b2b/{uid}/edit', [\App\Http\Controllers\Admin\AgencyB2BController::class, 'edit'])->name('admin.agency-b2b.edit');
Route::put('agency-b2b/{uid}', [\App\Http\Controllers\Admin\AgencyB2BController::class, 'update'])->name('admin.agency-b2b.update');
Route::delete('agency-b2b/{uid}', [\App\Http\Controllers\Admin\AgencyB2BController::class, 'destroy'])->name('admin.agency-b2b.destroy');
Route::post('agency-b2b/{uid}/toggle-status', [\App\Http\Controllers\Admin\AgencyB2BController::class, 'toggleStatus'])->name('admin.agency-b2b.toggle-status');
Route::post('agency-b2b/{uid}/permissions', [\App\Http\Controllers\Admin\AgencyB2BController::class, 'updatePermissions'])->name('admin.agency-b2b.permissions');
Route::post('agency-b2b/validate-step', [\App\Http\Controllers\Admin\AgencyB2BController::class, 'validateFormStep'])->name('admin.agency-b2b.validate-step');
Route::delete('agency-documents/{id}', [\App\Http\Controllers\Admin\AgencyB2BController::class, 'deleteDocument'])->name('agency-documents.destroy');
