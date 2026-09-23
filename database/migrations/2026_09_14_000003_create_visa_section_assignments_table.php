<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visa_section_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visa_id')->constrained()->cascadeOnDelete();
            $table->foreignId('visa_section_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_enabled')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['visa_id', 'visa_section_id']);
            $table->index(['visa_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visa_section_assignments');
    }
};
