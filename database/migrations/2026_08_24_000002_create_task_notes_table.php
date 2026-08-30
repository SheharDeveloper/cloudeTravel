<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            // Who wrote the note: App\Models\User or App\Models\AgencyUser
            $table->nullableMorphs('author');
            $table->text('note');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_notes');
    }
};
