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
            $table->string('flight_origin')->nullable();
            $table->string('flight_destination')->nullable();

            // Hotel
            $table->string('hotel_name')->nullable();
            $table->integer('hotel_star_rating')->nullable();
            $table->string('hotel_country')->nullable();
            $table->string('hotel_city')->nullable();

            // Visa
            $table->string('visa_name')->nullable();
            $table->string('visa_destination_country')->nullable();
            $table->string('visa_passport_country')->nullable();
            $table->integer('visa_type')->nullable();

            // Package
            $table->string('package_country')->nullable();
            $table->string('package_city')->nullable();

            // Transportation
            $table->string('transport_name')->nullable();
            $table->string('transport_type')->nullable();
            $table->string('transport_origin')->nullable();
            $table->string('transport_destination')->nullable();

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
            $table->dropColumn([
                'flight_name', 'flight_origin', 'flight_destination',
                'hotel_name', 'hotel_star_rating', 'hotel_country', 'hotel_city',
                'visa_name', 'visa_destination_country', 'visa_passport_country', 'visa_type',
                'package_country', 'package_city',
                'transport_name', 'transport_type', 'transport_origin', 'transport_destination',
                'rating', 'is_visa', 'is_transport'
            ]);
        });
    }
};
