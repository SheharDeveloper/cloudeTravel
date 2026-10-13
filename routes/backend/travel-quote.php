<?php

use Illuminate\Support\Facades\Route;

// Travel Quote Management
Route::get('travel-quote', [\App\Http\Controllers\Admin\TravelQuoteController::class, 'index'])->name('admin.travel-quote.index');
Route::post('travel-quote', [\App\Http\Controllers\Admin\TravelQuoteController::class, 'store'])->name('admin.travel-quote.store');
Route::get('travel-quote/{travelQuote:uid}', [\App\Http\Controllers\Admin\TravelQuoteController::class, 'show'])->name('admin.travel-quote.show');
Route::put('travel-quote/{travelQuote:uid}', [\App\Http\Controllers\Admin\TravelQuoteController::class, 'update'])->name('admin.travel-quote.update');
Route::delete('travel-quote/{travelQuote:uid}', [\App\Http\Controllers\Admin\TravelQuoteController::class, 'destroy'])->name('admin.travel-quote.destroy');
// Invoice tab: "Generate Invoice" for a customer who accepted the quote
Route::post('travel-quote/{travelQuote:uid}/feedback/{feedback}/invoice', [\App\Http\Controllers\Admin\TravelQuoteController::class, 'generateInvoice'])->whereNumber('feedback')->name('admin.travel-quote.invoice');

// Travel Quote Feedback Status Update
Route::put('travel-quote-feedback/{id}/status', [\App\Http\Controllers\Admin\TravelQuoteFeedbackController::class, 'updateStatus'])->name('travel-quote-feedback.update-status');
