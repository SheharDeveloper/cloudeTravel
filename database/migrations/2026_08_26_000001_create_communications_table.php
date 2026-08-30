<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('communications', function (Blueprint $table) {
            $table->id();
            // What this communication is about: App\Models\Client (and, in
            // future, any other model that can have a communication log)
            $table->morphs('communicable');
            // Who logged it: App\Models\User or App\Models\AgencyUser
            $table->nullableMorphs('causer');
            $table->text('description');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communications');
    }
};
