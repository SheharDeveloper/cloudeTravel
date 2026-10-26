<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A staff member's salary slip for a month: hours actually worked × their
 * hourly rate, less their tax and deductions. Superadmin and agency staff
 * alike, through the staffable morph.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salary_slips', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->unique();
            $table->morphs('staffable');
            $table->string('owner_type')->nullable();
            $table->unsignedBigInteger('owner_id')->nullable();
            $table->char('month', 7);
            $table->string('staff_name');
            $table->decimal('salary', 12, 2)->nullable();
            $table->string('salary_type')->nullable();
            $table->string('currency', 10)->nullable();
            $table->string('shift')->nullable();
            $table->unsignedTinyInteger('days_present')->default(0);
            $table->unsignedTinyInteger('days_leave')->default(0);
            $table->unsignedTinyInteger('days_absent')->default(0);
            $table->unsignedInteger('worked_minutes')->default(0);
            $table->decimal('hourly_rate', 12, 4)->nullable();
            $table->decimal('gross', 12, 2)->default(0);
            $table->json('deductions')->nullable();
            $table->decimal('total_deductions', 12, 2)->default(0);
            $table->decimal('net', 12, 2)->default(0);
            $table->string('generated_by')->nullable();
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();
            $table->unique(['staffable_type', 'staffable_id', 'month']);
            $table->index(['owner_type', 'owner_id', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salary_slips');
    }
};
