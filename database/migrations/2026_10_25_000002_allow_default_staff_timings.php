<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A staff_timings row with no staffable is the owner's default working hours
 * (an agency's, or the superadmin's), used by every staff member for any
 * field they don't have set themselves.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('staff_timings', function (Blueprint $table) {
            $table->string('staffable_type')->nullable()->change();
            $table->unsignedBigInteger('staffable_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        \App\Models\StaffTiming::whereNull('staffable_type')->delete();

        Schema::table('staff_timings', function (Blueprint $table) {
            $table->string('staffable_type')->nullable(false)->change();
            $table->unsignedBigInteger('staffable_id')->nullable(false)->change();
        });
    }
};
