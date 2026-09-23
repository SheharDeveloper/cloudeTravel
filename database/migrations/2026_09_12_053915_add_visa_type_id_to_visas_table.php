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
        Schema::table('visas', function (Blueprint $table) {
            $table->foreignId('visa_type_id')->nullable()->after('id')->constrained('visa_types')->nullOnDelete();
            $table->foreignId('origin_country_id')->nullable()->after('visa_type_id')->constrained('countries')->nullOnDelete();
            $table->foreignId('destination_country_id')->nullable()->after('origin_country_id')->constrained('countries')->nullOnDelete();
            $table->foreignId('visa_service_category_id')->nullable()->after('destination_country_id')->constrained('visa_service_categories')->nullOnDelete();
            $table->string('name')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visas', function (Blueprint $table) {
            $table->string('name')->nullable(false)->change();
            $table->dropConstrainedForeignId('visa_service_category_id');
            $table->dropConstrainedForeignId('destination_country_id');
            $table->dropConstrainedForeignId('origin_country_id');
            $table->dropConstrainedForeignId('visa_type_id');
        });
    }
};
