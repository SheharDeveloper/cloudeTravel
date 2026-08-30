<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_documents', function (Blueprint $table) {
            $table->id();
            // What this document belongs to: App\Models\Client (and, in future,
            // any other model that can own uploaded documents)
            $table->morphs('documentable');
            // Who the document belongs to: App\Models\Agency or App\Models\User
            $table->nullableMorphs('owner');
            // The folder this document sits in, or null for the client's root
            $table->foreignId('folder_id')->nullable()->constrained('client_folders')->cascadeOnDelete();
            $table->string('document_name', 255);
            $table->string('document_type', 100)->default('other');
            $table->string('file_path', 255);
            $table->string('file_type', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_documents');
    }
};
