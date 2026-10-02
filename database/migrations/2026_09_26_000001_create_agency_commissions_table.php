<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Each agency's own commission per service (visa, hotel…), added on top
     * of the service fee: a percentage of it, or a fixed amount in the base
     * currency the fees are entered in. The superadmin has none.
     */
    public function up(): void
    {
        Schema::create('agency_commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->onDelete('cascade');
            $table->string('service_name');
            $table->string('commission_type')->default('percentage');
            $table->decimal('commission_value', 10, 2)->default(0);
            $table->timestamps();

            $table->unique(['agency_id', 'service_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agency_commissions');
    }
};
