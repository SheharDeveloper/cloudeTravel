<?php

use Illuminate\Support\Facades\Route;

// Task Board — shared board scoped per agency/superadmin. Admin/owner
// creates, assigns and deletes tasks; staff move/remark/attach on tasks
// assigned to them.
Route::get('tasks', [\App\Http\Controllers\Admin\TaskController::class, 'index'])->name('admin.tasks.index');
Route::post('tasks', [\App\Http\Controllers\Admin\TaskController::class, 'store'])->name('admin.tasks.store');
Route::get('tasks/{uid}', [\App\Http\Controllers\Admin\TaskController::class, 'show'])->name('admin.tasks.show');
Route::put('tasks/{uid}', [\App\Http\Controllers\Admin\TaskController::class, 'update'])->name('admin.tasks.update');
Route::patch('tasks/{uid}/status', [\App\Http\Controllers\Admin\TaskController::class, 'updateStatus'])->name('admin.tasks.update-status');
Route::patch('tasks/{uid}/assign', [\App\Http\Controllers\Admin\TaskController::class, 'assign'])->name('admin.tasks.assign');
Route::patch('tasks/{uid}/remark', [\App\Http\Controllers\Admin\TaskController::class, 'updateRemark'])->name('admin.tasks.update-remark');
Route::post('tasks/{uid}/notes', [\App\Http\Controllers\Admin\TaskController::class, 'storeNote'])->name('admin.tasks.notes.store');
Route::post('tasks/{uid}/attachments', [\App\Http\Controllers\Admin\TaskController::class, 'storeAttachment'])->name('admin.tasks.attachments.store');
Route::delete('tasks/{uid}/attachments/{attachmentId}', [\App\Http\Controllers\Admin\TaskController::class, 'destroyAttachment'])->name('admin.tasks.attachments.destroy');
Route::delete('tasks/{uid}', [\App\Http\Controllers\Admin\TaskController::class, 'destroy'])->name('admin.tasks.destroy');
