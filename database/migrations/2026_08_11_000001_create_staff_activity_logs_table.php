<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_activity_logs', function (Blueprint $table) {
            $table->id();
            // Which staff member this entry is about: App\Models\User or App\Models\AgencyUser
            $table->morphs('staffable');
            // Who performed the action: the signed-in superadmin User or AgencyUser
            $table->nullableMorphs('causer');
            $table->string('action', 100);
            $table->string('description', 500);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_activity_logs');
    }
};
