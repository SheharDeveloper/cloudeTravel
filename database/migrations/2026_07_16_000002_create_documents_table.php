<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('public_documents', function (Blueprint $table) {
            $table->id();
            // Who this document belongs to: App\Models\Agency (their own
            // site) or App\Models\User (the superadmin's global default,
            // shown to any agency that hasn't added its own).
            $table->nullableMorphs('owner');
            $table->string('title');
            $table->string('document_path');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('public_documents');
    }
};
