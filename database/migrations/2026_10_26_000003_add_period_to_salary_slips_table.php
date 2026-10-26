<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A salary slip covers a period, not a calendar month: from the end of the
 * staff member's last slip (or their joining date) up to when it's generated.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('salary_slips', function (Blueprint $table) {
            $table->dropUnique(['staffable_type', 'staffable_id', 'month']);
            $table->dateTime('period_start')->nullable()->after('month');
            $table->dateTime('period_end')->nullable()->after('period_start');
            $table->index(['staffable_type', 'staffable_id', 'period_end']);
        });

        // Slips so far were for a month: it started on the 1st and ran until generated
        DB::table('salary_slips')->orderBy('id')->each(function ($slip) {
            DB::table('salary_slips')->where('id', $slip->id)->update([
                'period_start' => "{$slip->month}-01 00:00:00",
                'period_end' => $slip->generated_at ?? date('Y-m-t 23:59:59', strtotime("{$slip->month}-01")),
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('salary_slips', function (Blueprint $table) {
            $table->dropIndex(['staffable_type', 'staffable_id', 'period_end']);
            $table->dropColumn(['period_start', 'period_end']);
            $table->unique(['staffable_type', 'staffable_id', 'month']);
        });
    }
};
