<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_images', function (Blueprint $table) {
            $table->id();
            $table->string('image_url');
            $table->string('title')->nullable();
            $table->text('subtitle')->nullable();
            $table->tinyInteger('status')->default(1); // 1 = active, 0 = inactive
            $table->integer('order')->default(0); // Display order
            $table->unsignedBigInteger('recorder')->nullable(); // User who created/recorded
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_images');
    }
};
