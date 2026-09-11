<?php

use Illuminate\Support\Facades\Route;

// Client Management
Route::get('clients', [\App\Http\Controllers\Admin\ClientController::class, 'index'])->name('admin.client.index');
Route::get('clients/create', [\App\Http\Controllers\Admin\ClientController::class, 'create'])->name('admin.client.create');
Route::post('clients', [\App\Http\Controllers\Admin\ClientController::class, 'store'])->name('admin.client.store');
Route::get('clients/{uid}', [\App\Http\Controllers\Admin\ClientController::class, 'show'])->name('admin.client.show');
Route::get('clients/{uid}/edit', [\App\Http\Controllers\Admin\ClientController::class, 'edit'])->name('admin.client.edit');
Route::put('clients/{uid}', [\App\Http\Controllers\Admin\ClientController::class, 'update'])->name('admin.client.update');
Route::delete('clients/{uid}', [\App\Http\Controllers\Admin\ClientController::class, 'destroy'])->name('admin.client.destroy');
Route::post('clients/{uid}/toggle-status', [\App\Http\Controllers\Admin\ClientController::class, 'toggleStatus'])->name('admin.client.toggle-status');
Route::post('clients/validate-step', [\App\Http\Controllers\Admin\ClientController::class, 'validateFormStep'])->name('admin.client.validate-step');
Route::post('clients/{uid}/documents', [\App\Http\Controllers\Admin\ClientController::class, 'storeDocument'])->name('admin.client.documents.store');
Route::delete('client-documents/{id}', [\App\Http\Controllers\Admin\ClientController::class, 'destroyDocument'])->name('admin.client-documents.destroy');
Route::delete('clients/{uid}/documents-due', [\App\Http\Controllers\Admin\ClientController::class, 'destroyDueDocuments'])->name('admin.client.documents.destroy-due');
Route::post('clients/{uid}/folders', [\App\Http\Controllers\Admin\ClientController::class, 'storeFolder'])->name('admin.client.folders.store');
Route::delete('client-folders/{id}', [\App\Http\Controllers\Admin\ClientController::class, 'destroyFolder'])->name('admin.client-folders.destroy');
Route::delete('clients/{uid}/folders-due', [\App\Http\Controllers\Admin\ClientController::class, 'destroyDueFolders'])->name('admin.client.folders.destroy-due');
// Global navbar action — not scoped to a single client's uid.
Route::delete('clients-due-items', [\App\Http\Controllers\Admin\ClientController::class, 'destroyDueItems'])->name('admin.client.due-items.destroy');
Route::post('clients/{uid}/communications', [\App\Http\Controllers\Admin\ClientController::class, 'storeCommunication'])->name('admin.client.communications.store');
Route::put('client-communications/{id}', [\App\Http\Controllers\Admin\ClientController::class, 'updateCommunication'])->name('admin.client-communications.update');
Route::delete('client-communications/{id}', [\App\Http\Controllers\Admin\ClientController::class, 'destroyCommunication'])->name('admin.client-communications.destroy');
