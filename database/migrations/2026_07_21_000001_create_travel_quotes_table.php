<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('travel_quotes', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->string('display_name');
            $table->date('check_in_date');
            $table->date('checkout_date');
            $table->integer('night');
            $table->json('hotel_details')->nullable();
            $table->json('flight_details')->nullable();
            $table->json('visa_details')->nullable();
            $table->json('travel_details')->nullable();
            $table->date('expiry_date')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('half_board')->nullable();
            $table->string('all_inclusive')->nullable();
            $table->boolean('show_hotel_name')->default(false);
            $table->boolean('show_individual_price')->default(false);
            $table->boolean('per_person_pricing')->default(false);
            $table->decimal('total_price', 12, 2)->nullable();
            $table->json('images')->nullable();
            $table->integer('adults')->default(1);
            $table->integer('children')->default(0);
            $table->integer('infants')->default(0);
            $table->json('price_summary')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('travel_quotes');
    }
};
