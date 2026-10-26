<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Each staff member's working hours — superadmin staff (User) and agency
     * staff (AgencyUser) alike, through the staffable morph — and the owner
     * (an agency, or none for the superadmin side). Attendance uses them for
     * hours worked, the day's pay and lunches that ran over.
     */
    public function up(): void
    {
        Schema::create('staff_timings', function (Blueprint $table) {
            $table->id();
            $table->morphs('staffable');
            $table->string('owner_type')->nullable();
            $table->unsignedBigInteger('owner_id')->nullable();
            $table->time('shift_start')->nullable();
            $table->time('shift_end')->nullable();
            // Lunch allowed, in minutes
            $table->unsignedSmallInteger('lunch_minutes')->nullable();
            // For a monthly salary: working days a month
            $table->unsignedTinyInteger('working_days')->nullable();
            $table->timestamps();

            $table->unique(['staffable_type', 'staffable_id']);
            $table->index(['owner_type', 'owner_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_timings');
    }
};
