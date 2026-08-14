<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_profiles', function (Blueprint $table) {
            $table->id();
            // Who this record describes: App\Models\User (superadmin staff)
            // or App\Models\AgencyUser (agency staff)
            $table->morphs('staffable');
            // Who the staff member belongs to: App\Models\Agency or App\Models\User
            $table->nullableMorphs('owner');
            $table->date('dob')->nullable();
            $table->string('passport_number', 100)->nullable();
            $table->string('country', 255)->nullable();
            $table->string('zip_code_id', 255)->nullable();
            $table->string('address_id', 255)->nullable();
            $table->string('street_id', 255)->nullable();
            $table->string('county', 255)->nullable();
            $table->string('city', 255)->nullable();
            $table->string('address', 500)->nullable();
            $table->json('skills')->nullable();
            $table->timestamps();
        });

        Schema::create('staff_payments', function (Blueprint $table) {
            $table->id();
            $table->morphs('staffable');
            $table->nullableMorphs('owner');
            $table->decimal('salary', 12, 2)->nullable();
            $table->enum('salary_type', ['per_day', 'per_month'])->default('per_month');
            $table->string('currency', 10)->nullable();
            $table->string('bank_name', 255)->nullable();
            $table->string('account_number', 50)->nullable();
            $table->string('ifsc_code', 20)->nullable();
            $table->timestamps();
        });

        Schema::create('staff_educations', function (Blueprint $table) {
            $table->id();
            $table->morphs('staffable');
            $table->nullableMorphs('owner');
            $table->string('name', 255);
            $table->string('photo', 255)->nullable();
            $table->timestamps();
        });

        Schema::create('staff_tax_deductions', function (Blueprint $table) {
            $table->id();
            $table->morphs('staffable');
            $table->nullableMorphs('owner');
            $table->string('name', 255);
            $table->decimal('value', 12, 2)->default(0);
            $table->enum('type', ['tax', 'deduction'])->default('tax');
            $table->timestamps();
        });

        Schema::create('staff_passports', function (Blueprint $table) {
            $table->id();
            $table->morphs('staffable');
            $table->nullableMorphs('owner');
            $table->string('passport_number', 100)->nullable();
            $table->string('place_of_issue', 255)->nullable();
            $table->date('date_of_issue')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('front_image', 255)->nullable();
            $table->string('back_image', 255)->nullable();
            // Same country / same company as the agency -> no visa needed
            $table->boolean('is_foreigner')->default(false);
            $table->string('visa_type', 100)->nullable();
            $table->string('visa_number', 100)->nullable();
            $table->date('visa_expiry_date')->nullable();
            $table->timestamps();
        });

        Schema::create('staff_documents', function (Blueprint $table) {
            $table->id();
            $table->morphs('staffable');
            $table->nullableMorphs('owner');
            $table->string('document_name', 255);
            $table->string('document_type', 100)->nullable();
            $table->string('file_path', 255)->nullable();
            $table->string('file_type', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_documents');
        Schema::dropIfExists('staff_passports');
        Schema::dropIfExists('staff_tax_deductions');
        Schema::dropIfExists('staff_educations');
        Schema::dropIfExists('staff_payments');
        Schema::dropIfExists('staff_profiles');
    }
};
