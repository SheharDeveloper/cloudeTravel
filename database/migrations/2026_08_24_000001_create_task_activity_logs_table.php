<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            // Who performed the action: App\Models\User or App\Models\AgencyUser
            $table->nullableMorphs('causer');
            $table->string('action', 100);
            $table->string('description', 500);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_activity_logs');
    }
};
