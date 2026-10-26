<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * MySQL gave the first TIMESTAMP column "ON UPDATE CURRENT_TIMESTAMP", so any
 * update to a day (check-out, an admin correction, extending the time) reset
 * the check-in time to now. Redefine it without that.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->timestamp('checked_in_at')->useCurrent()->change();
        });
    }

    public function down(): void
    {
        // Not restored: the auto-update was never intended
    }
};
