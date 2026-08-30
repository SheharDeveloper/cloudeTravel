<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_types', function (Blueprint $table) {
            $table->id();
            // The agency that defined this leave type, or null for a
            // superadmin-managed type — same ownership pattern used
            // throughout the staff/attendance tables.
            $table->nullableMorphs('owner');
            $table->string('name', 100);
            $table->unsignedSmallInteger('days');
            $table->timestamps();
        });

        Schema::table('attendance_histories', function (Blueprint $table) {
            $table->foreignId('leave_type_id')->nullable()->after('batch_id')
                ->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('attendance_histories', function (Blueprint $table) {
            $table->dropConstrainedForeignId('leave_type_id');
        });

        Schema::dropIfExists('leave_types');
    }
};
