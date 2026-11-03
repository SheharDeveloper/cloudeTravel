<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Paid or unpaid leave: an approved day of a paid leave type is paid as a
 * full working day on the salary slip; an unpaid one isn't. The slip keeps
 * how many paid / unpaid leave days it covered and what the paid ones came to.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leave_types', function (Blueprint $table) {
            $table->boolean('is_paid')->default(true)->after('days');
        });

        Schema::table('salary_slips', function (Blueprint $table) {
            $table->unsignedTinyInteger('paid_leave_days')->default(0)->after('days_leave');
            $table->unsignedTinyInteger('unpaid_leave_days')->default(0)->after('paid_leave_days');
            $table->decimal('paid_leave_pay', 12, 2)->default(0)->after('hourly_rate');
        });
    }

    public function down(): void
    {
        Schema::table('leave_types', function (Blueprint $table) {
            $table->dropColumn('is_paid');
        });

        Schema::table('salary_slips', function (Blueprint $table) {
            $table->dropColumn(['paid_leave_days', 'unpaid_leave_days', 'paid_leave_pay']);
        });
    }
};
