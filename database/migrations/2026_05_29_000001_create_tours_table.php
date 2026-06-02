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
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->string('tour_title'); // Tour title
            $table->string('hero_title'); // Hero section title
            $table->text('hero_subtitle')->nullable(); // Hero subtitle
            $table->text('short_description')->nullable(); // Short description
            $table->longText('full_description')->nullable(); // Full description
            $table->string('country'); // Country name
            $table->string('city'); // City name
            $table->integer('duration_days'); // Tour duration in days
            $table->date('start_date'); // Tour start date
            $table->date('end_date'); // Tour end date
            $table->enum('status', ['active', 'inactive', 'draft'])->default('draft'); // Tour status
            $table->string('early_booking_price_text')->nullable(); // Early booking text
            $table->string('feature_image')->nullable(); // Feature image path
            $table->json('banner_images')->nullable(); // Multiple banner images
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
