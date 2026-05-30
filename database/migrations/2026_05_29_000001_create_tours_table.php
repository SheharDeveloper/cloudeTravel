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
            $table->string('name'); // Tours Name
            $table->string('image')->nullable(); // Tour image
            $table->string('duration'); // Time/Duration (e.g., "7 Days")
            $table->string('subtitle'); // Subtitle
            $table->longText('description'); // Description
            $table->longText('highlights')->nullable(); // Highlights (JSON array)
            $table->longText('itinerary')->nullable(); // Itinerary details (JSON array)
            $table->longText('package_includes')->nullable(); // What's included (JSON array)
            $table->longText('package_excludes')->nullable(); // What's not included (JSON array)
            $table->longText('terms_conditions')->nullable(); // T&C
            $table->decimal('price', 10, 2)->nullable(); // Price
            $table->string('location')->nullable(); // Location
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
