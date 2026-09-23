<?php

use App\Http\Controllers\Admin\VisaController;
use App\Http\Controllers\Admin\VisaTypeController;
use Illuminate\Support\Facades\Route;

// Visa Types (name + description CRUD)
Route::get('visa-types', [VisaTypeController::class, 'index'])->name('admin.visa-types.index');
Route::post('visa-types', [VisaTypeController::class, 'store'])->name('admin.visa-types.store');
Route::put('visa-types/{visaType}', [VisaTypeController::class, 'update'])->name('admin.visa-types.update');
Route::delete('visa-types/{visaType}', [VisaTypeController::class, 'destroy'])->name('admin.visa-types.destroy');

// Visas — Inertia pages plus the create / update / status / delete actions
Route::get('visa-search', [VisaController::class, 'search'])->name('admin.visa-search');
Route::get('visa-search/result', [VisaController::class, 'searchResult'])->name('admin.visa-search.result');
Route::get('visa-services', [VisaController::class, 'index'])->name('admin.visa-services.index');
Route::get('visa-services/create', [VisaController::class, 'create'])->name('admin.visa-services.create');
Route::post('visa-services/validate', [VisaController::class, 'validateStep'])->name('admin.visa-services.validate');
Route::post('visa-services', [VisaController::class, 'store'])->name('admin.visa-services.store');
Route::get('visa-services/{visa}', [VisaController::class, 'show'])->name('admin.visa-services.show');
Route::get('visa-services/{visa}/edit', [VisaController::class, 'edit'])->name('admin.visa-services.edit');
Route::get('visa-services/{visa}/fields', [VisaController::class, 'editFields'])->name('admin.visa-services.fields.edit');
Route::put('visa-services/{visa}/fields', [VisaController::class, 'updateFields'])->name('admin.visa-services.fields.update');
Route::put('visa-services/{visa}/documents', [VisaController::class, 'updateDocuments'])->name('admin.visa-services.documents.update');
Route::put('visa-services/{visa}', [VisaController::class, 'update'])->name('admin.visa-services.update');
Route::patch('visa-services/{visa}/status', [VisaController::class, 'toggleStatus'])->name('admin.visa-services.status');
Route::delete('visa-services/{visa}', [VisaController::class, 'destroy'])->name('admin.visa-services.destroy');
