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
        Schema::create('visa_cost_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visa_id')->constrained('visas')->cascadeOnDelete();

            // 'type' holds the Tourism & Business "type of business" text, or the
            // Work & Immigration "processing type" text — whichever the visa's
            // category calls for.
            $table->string('type')->nullable();

            // Tourism & Business fields
            $table->string('validation_process')->nullable();
            $table->string('processing_time')->nullable();
            $table->decimal('embassy_fee', 10, 2)->nullable();
            $table->decimal('service_fee', 10, 2)->nullable();
            $table->decimal('tax_fee', 10, 2)->nullable();

            // Work & Immigration fields
            $table->decimal('credit_amount', 10, 2)->nullable();
            $table->decimal('tax_amount', 10, 2)->nullable();

            // Shared: embassy_fee + service_fee + tax_fee, or credit_amount + tax_amount
            $table->decimal('total_cost', 10, 2)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visa_cost_details');
    }
};
