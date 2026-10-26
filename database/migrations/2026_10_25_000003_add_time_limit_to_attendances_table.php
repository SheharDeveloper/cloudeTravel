<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A staff member is checked out automatically once their shift length has
 * passed since check-in; an admin can extend the day by some minutes.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->unsignedSmallInteger('extended_minutes')->default(0)->after('checked_out_at');
            $table->timestamp('auto_checked_out_at')->nullable()->after('extended_minutes');
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['extended_minutes', 'auto_checked_out_at']);
        });
    }
};
