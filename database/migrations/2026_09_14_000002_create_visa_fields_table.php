<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visa_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visa_section_id')->constrained()->cascadeOnDelete();
            $table->string('field_name');
            $table->string('slug');
            $table->string('field_type')->default('text');
            $table->boolean('status')->default(true)->index();
            $table->timestamps();

            $table->unique(['visa_section_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visa_fields');
    }
};
