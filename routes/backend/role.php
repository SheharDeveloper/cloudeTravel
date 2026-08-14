<?php

use Illuminate\Support\Facades\Route;

// Role & Permission Management
Route::get('roles', [\App\Http\Controllers\Admin\RoleController::class, 'index'])->name('admin.roles.index');
Route::get('roles/create', [\App\Http\Controllers\Admin\RoleController::class, 'create'])->name('admin.roles.create');
Route::post('roles', [\App\Http\Controllers\Admin\RoleController::class, 'store'])->name('admin.roles.store');
Route::get('roles/{uid}/edit', [\App\Http\Controllers\Admin\RoleController::class, 'edit'])->name('admin.roles.edit');
Route::put('roles/{uid}', [\App\Http\Controllers\Admin\RoleController::class, 'update'])->name('admin.roles.update');
Route::delete('roles/{uid}', [\App\Http\Controllers\Admin\RoleController::class, 'destroy'])->name('admin.roles.destroy');
