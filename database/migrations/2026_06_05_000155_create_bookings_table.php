<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();

            // User Information
            $table->string('first_name');
            $table->string('email');
            $table->string('country_code');
            $table->string('phone');

            // Booking Type
            $table->enum('type', ['flight', 'hotel', 'visa', 'package', 'transport'])->comment('Service type');

            // Service-specific JSON data
            $table->json('flight_data')->nullable()->comment('Flight details');
            $table->json('hotel_data')->nullable()->comment('Hotel details');
            $table->json('visa_data')->nullable()->comment('Visa details');
            $table->json('package_data')->nullable()->comment('Package details');
            $table->json('airport_transport_data')->nullable()->comment('Airport transport details');

            // Optional foreign keys
            $table->unsignedBigInteger('visa_type_id')->nullable()->comment('Link to visa type if visa booking');
            $table->unsignedBigInteger('special_offer_id')->nullable()->comment('Link to special offer if chosen');

            // Status
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');

            // Legacy columns (keeping for compatibility)
            $table->string('service')->nullable()->comment('flight, hotel, visa, package, or transport');
            $table->text('notes')->nullable();

            // Timestamps
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('type');
            $table->index('status');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
