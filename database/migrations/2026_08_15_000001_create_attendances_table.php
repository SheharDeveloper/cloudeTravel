<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->morphs('staffable');
            $table->nullableMorphs('owner');
            $table->date('date');
            $table->timestamp('checked_in_at');
            $table->timestamps();

            $table->unique(['staffable_type', 'staffable_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
