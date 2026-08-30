<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_histories', function (Blueprint $table) {
            $table->id();
            $table->morphs('staffable');
            $table->nullableMorphs('owner');
            $table->date('date');
            // 'check_in', 'check_out', 'lunch_start', 'lunch_end', 'half_day',
            // 'leave_applied', 'leave_approved', 'leave_rejected', 'status_updated'
            $table->string('event', 30);
            // Ties together the multiple daily rows created by one leave
            // application (start date to end date), so they can be listed
            // and approved/rejected as a single request.
            $table->uuid('batch_id')->nullable();
            // Snapshot of the day's overall status as of this event, when relevant
            $table->enum('status', ['present', 'half_day', 'leave', 'absent'])->nullable();
            $table->enum('work_type', ['office', 'remote', 'field'])->nullable();
            $table->timestamp('occurred_at');
            $table->string('notes', 500)->nullable();
            $table->nullableMorphs('causer');
            $table->timestamps();

            $table->index(['staffable_type', 'staffable_id', 'date']);
            $table->index('batch_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_histories');
    }
};
