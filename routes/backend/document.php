<?php

use Illuminate\Support\Facades\Route;

// Public Documents
Route::get('documents', [\App\Http\Controllers\Admin\DocumentController::class, 'index'])->name('admin.documents.index');
Route::post('documents', [\App\Http\Controllers\Admin\DocumentController::class, 'store'])->name('admin.documents.store');
Route::put('documents/{publicDocument}', [\App\Http\Controllers\Admin\DocumentController::class, 'update'])->name('admin.documents.update');
Route::delete('documents/{publicDocument}', [\App\Http\Controllers\Admin\DocumentController::class, 'destroy'])->name('admin.documents.destroy');
