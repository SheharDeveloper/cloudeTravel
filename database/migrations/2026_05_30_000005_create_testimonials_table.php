<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->string('client_name');
            $table->string('client_image')->nullable();
            $table->text('message');
            $table->integer('rating')->default(5); // 1-5 stars
            $table->tinyInteger('status')->default(1); // 1 = active, 0 = inactive
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
