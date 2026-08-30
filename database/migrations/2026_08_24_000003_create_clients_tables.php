<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            // Who this client belongs to: App\Models\Agency or App\Models\User (superadmin)
            $table->nullableMorphs('owner');
            $table->string('name', 255);
            $table->string('email', 255)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('nationality', 100)->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->date('dob')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('client_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('address', 500)->nullable();
            $table->string('city', 255)->nullable();
            $table->string('state', 255)->nullable();
            $table->string('country', 255)->nullable();
            $table->string('zip_code', 20)->nullable();
            $table->timestamps();
        });

        Schema::create('client_passports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('passport_number', 100)->nullable();
            $table->string('place_of_issue', 255)->nullable();
            $table->date('date_of_issue')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('front_image', 255)->nullable();
            $table->string('back_image', 255)->nullable();
            $table->boolean('is_foreigner')->default(false);
            $table->string('visa_type', 100)->nullable();
            $table->string('visa_number', 100)->nullable();
            $table->date('visa_expiry_date')->nullable();
            $table->timestamps();
        });

        Schema::create('client_family_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('name', 255);
            $table->string('relation', 100)->nullable();
            $table->date('dob')->nullable();
            $table->string('passport_number', 100)->nullable();
            $table->string('id_number', 100)->nullable();
            $table->timestamps();
        });

        Schema::create('client_folders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            // The parent folder, or null for a top-level folder
            $table->foreignId('parent_id')->nullable()->constrained('client_folders')->cascadeOnDelete();
            // Who created the folder: App\Models\Agency or App\Models\User
            $table->nullableMorphs('owner');
            $table->string('name', 255);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_folders');
        Schema::dropIfExists('client_family_members');
        Schema::dropIfExists('client_passports');
        Schema::dropIfExists('client_addresses');
        Schema::dropIfExists('clients');
    }
};
