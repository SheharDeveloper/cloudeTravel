<?php

use Illuminate\Support\Facades\Route;

// Special Offer Management
Route::resource('special-offer', \App\Http\Controllers\Admin\SpecialOfferController::class)->except(['show'])->names('admin.special-offer');
Route::get('special-offer/{uid}', [\App\Http\Controllers\Admin\SpecialOfferController::class, 'show'])->name('admin.special-offer.show');
Route::delete('special-offer/{uid}/images/{imageId}', [\App\Http\Controllers\Admin\SpecialOfferController::class, 'deleteImage'])->name('admin.special-offer.delete-image');
