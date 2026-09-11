<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A global reference table of countries — not scoped to any
        // agency/owner, shared across the whole application.
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('countryCode', 10)->unique();
            $table->string('countryName', 255);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('countries');
    }
};
