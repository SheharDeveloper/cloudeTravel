<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * "Send to Admin": an agency hands a filled-in visa application to the
     * superadmin. Set once sent; the superadmin's Agency Applications list
     * shows every application that has it.
     */
    public function up(): void
    {
        Schema::table('booking_applications', function (Blueprint $table) {
            $table->timestamp('sent_to_admin_at')->nullable()->after('status');
            $table->string('sent_by_type')->nullable()->after('sent_to_admin_at');
            $table->unsignedBigInteger('sent_by_id')->nullable()->after('sent_by_type');
            $table->index('sent_to_admin_at');
        });
    }

    public function down(): void
    {
        Schema::table('booking_applications', function (Blueprint $table) {
            $table->dropIndex(['sent_to_admin_at']);
            $table->dropColumn(['sent_to_admin_at', 'sent_by_type', 'sent_by_id']);
        });
    }
};
