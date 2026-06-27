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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->string('name')->unique();
            $table->string('title');
            $table->longText('description')->nullable();
            $table->string('image')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->string('currency')->default('USD');
            $table->string('origin_country')->nullable();
            $table->string('destination_country');
            $table->string('hotel_name')->nullable();
            $table->integer('hotel_stars')->default(0);
            $table->integer('duration_days')->default(0);
            $table->boolean('travel_export_included')->default(false);
            $table->boolean('visa_service_included')->default(false);
            $table->boolean('status')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
