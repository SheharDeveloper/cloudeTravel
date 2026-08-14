<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE staff_payments MODIFY salary_type ENUM('per_day', 'per_hour', 'per_month') NOT NULL DEFAULT 'per_month'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE staff_payments MODIFY salary_type ENUM('per_day', 'per_month') NOT NULL DEFAULT 'per_month'");
    }
};
