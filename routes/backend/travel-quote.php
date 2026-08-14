<?php

use Illuminate\Support\Facades\Route;

// Travel Quote Management
Route::get('travel-quote', [\App\Http\Controllers\Admin\TravelQuoteController::class, 'index'])->name('admin.travel-quote.index');
Route::post('travel-quote', [\App\Http\Controllers\Admin\TravelQuoteController::class, 'store'])->name('admin.travel-quote.store');
Route::get('travel-quote/{travelQuote:uid}', [\App\Http\Controllers\Admin\TravelQuoteController::class, 'show'])->name('admin.travel-quote.show');
Route::put('travel-quote/{travelQuote:uid}', [\App\Http\Controllers\Admin\TravelQuoteController::class, 'update'])->name('admin.travel-quote.update');
Route::delete('travel-quote/{travelQuote:uid}', [\App\Http\Controllers\Admin\TravelQuoteController::class, 'destroy'])->name('admin.travel-quote.destroy');

// Travel Quote Feedback Status Update
Route::put('travel-quote-feedback/{id}/status', [\App\Http\Controllers\Admin\TravelQuoteFeedbackController::class, 'updateStatus'])->name('travel-quote-feedback.update-status');
