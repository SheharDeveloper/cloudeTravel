<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('travel_quote_feedback', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->unsignedBigInteger('travel_quote_id');
            $table->string('name');
            $table->string('email');
            $table->string('phone_number');
            $table->enum('status', ['inactive', 'active', 'pending', 'accept', 'reject'])->default('inactive');
            $table->text('reason')->nullable();
            $table->timestamps();

            $table->foreign('travel_quote_id')->references('id')->on('travel_quotes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('travel_quote_feedback');
    }
};
