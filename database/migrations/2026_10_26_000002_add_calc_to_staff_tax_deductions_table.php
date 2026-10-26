<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * How a tax or deduction is worked out on the salary slip: a percentage of
 * the pay, or a fixed amount. Rows so far: tax was a %, deduction fixed.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('staff_tax_deductions', function (Blueprint $table) {
            $table->string('calc', 10)->default('percent')->after('type');
        });

        DB::table('staff_tax_deductions')->where('type', 'deduction')->update(['calc' => 'fixed']);
    }

    public function down(): void
    {
        Schema::table('staff_tax_deductions', function (Blueprint $table) {
            $table->dropColumn('calc');
        });
    }
};
