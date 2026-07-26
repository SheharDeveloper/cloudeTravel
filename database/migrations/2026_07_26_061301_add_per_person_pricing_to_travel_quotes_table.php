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
        Schema::table('travel_quotes', function (Blueprint $table) {
            $table->boolean('per_person_pricing')->default(false)->after('show_individual_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('travel_quotes', function (Blueprint $table) {
            $table->dropColumn('per_person_pricing');
        });
    }
};
