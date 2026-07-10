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
        Schema::table('special_offers', function (Blueprint $table) {
            // Flight
            $table->string('flight_name')->nullable();
            // Hotel
            $table->string('hotel_name')->nullable();
            $table->integer('hotel_star_rating')->nullable();
            // Visa
            $table->string('visa_name')->nullable();
            // Transportation
            $table->string('transport_name')->nullable();
            $table->string('transport_type')->nullable();
            // Rating
            $table->decimal('rating', 2, 1)->nullable()->default(0);
            // Component flags
            $table->boolean('is_visa')->default(false);
            $table->boolean('is_transport')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('special_offers', function (Blueprint $table) {
            $table->dropColumn(['flight_name', 'hotel_name', 'hotel_star_rating', 'visa_name', 'transport_name', 'transport_type', 'rating', 'is_visa', 'is_transport']);
        });
    }
};
