<?php

use Illuminate\Support\Facades\Route;

// Attendance history — own calendar for staff, staff-selectable calendar for
// owner/superadmin. Shares App\Http\Controllers\AttendanceController with the
// check-in gate route registered in routes/frontend/web.php.
Route::get('attendance', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('admin.attendance.index');
Route::post('attendance/check-out', [\App\Http\Controllers\AttendanceController::class, 'checkOut'])->name('admin.attendance.check-out');
Route::post('attendance/lunch-start', [\App\Http\Controllers\AttendanceController::class, 'lunchStart'])->name('admin.attendance.lunch-start');
Route::post('attendance/lunch-end', [\App\Http\Controllers\AttendanceController::class, 'lunchEnd'])->name('admin.attendance.lunch-end');
Route::post('attendance/leave', [\App\Http\Controllers\AttendanceController::class, 'applyLeave'])->name('admin.attendance.apply-leave');
Route::put('attendance/leave/{batchId}', [\App\Http\Controllers\AttendanceController::class, 'updateLeave'])->name('admin.attendance.update-leave');
Route::post('attendance/{uid}/leave-response', [\App\Http\Controllers\AttendanceController::class, 'respondLeave'])->name('admin.attendance.respond-leave');
Route::patch('attendance/{uid}/day', [\App\Http\Controllers\AttendanceController::class, 'updateDay'])->name('admin.attendance.update-day');

// Leave Management
Route::get('leave', [\App\Http\Controllers\AttendanceController::class, 'leaveIndex'])->name('admin.leave.index');
Route::get('leave-requests', [\App\Http\Controllers\AttendanceController::class, 'leaveRequests'])->name('admin.leave-requests.index');

// Leave Types (owner/superadmin only, per-agency)
Route::post('leave-types', [\App\Http\Controllers\AttendanceController::class, 'storeLeaveType'])->name('admin.leave-types.store');
Route::put('leave-types/{id}', [\App\Http\Controllers\AttendanceController::class, 'updateLeaveType'])->name('admin.leave-types.update');
Route::delete('leave-types/{id}', [\App\Http\Controllers\AttendanceController::class, 'destroyLeaveType'])->name('admin.leave-types.destroy');
