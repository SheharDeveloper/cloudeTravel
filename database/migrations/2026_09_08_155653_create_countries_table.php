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
            // Public identifier used in URLs instead of the numeric id.
            $table->uuid('uid')->unique();
            $table->string('countryCode', 10)->unique();
            $table->string('countryName', 255);
            // ISO 4217 currency code (e.g. INR, GBP, USD) — distinct from
            // countryCode (the ISO country code), used for money labels.
            $table->string('currency_code', 10)->nullable();
            // Units of this country's local currency per 1 USD (the fixed
            // reference currency), used to convert amounts between countries.
            $table->decimal('exchange_rate', 15, 4)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('countries');
    }
};
