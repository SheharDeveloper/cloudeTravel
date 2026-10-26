<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Extra time an admin gives a staff member on a day, past their shift's end
 * time. Kept apart from the attendance row, since it can be given before the
 * staff member has checked in (after hours they can't sign in without it).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_extensions', function (Blueprint $table) {
            $table->id();
            $table->morphs('staffable');
            $table->string('owner_type')->nullable();
            $table->unsignedBigInteger('owner_id')->nullable();
            $table->date('date');
            $table->unsignedSmallInteger('minutes')->default(0);
            $table->string('granted_by')->nullable();
            $table->timestamps();
            $table->unique(['staffable_type', 'staffable_id', 'date']);
        });

        // Extensions given so far were counted from check-in; carry them over as they are
        DB::table('attendances')->where('extended_minutes', '>', 0)->orderBy('id')->each(function ($a) {
            DB::table('attendance_extensions')->insert([
                'staffable_type' => $a->staffable_type,
                'staffable_id' => $a->staffable_id,
                'owner_type' => $a->owner_type,
                'owner_id' => $a->owner_id,
                'date' => $a->date,
                'minutes' => $a->extended_minutes,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn('extended_minutes');
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->unsignedSmallInteger('extended_minutes')->default(0)->after('checked_out_at');
        });
        Schema::dropIfExists('attendance_extensions');
    }
};
