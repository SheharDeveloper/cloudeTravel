<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * "Fill Application" on a visa application: one form per application,
     * built from the fields configured on its visa, and one answer row per
     * field. Section and field names are kept as they were when answered,
     * so a filled form still reads correctly if the visa's fields change.
     */
    public function up(): void
    {
        Schema::create('application_forms', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('booking_application_id')->unique()->constrained('booking_applications')->cascadeOnDelete();
            $table->foreignId('visa_id')->nullable()->constrained('visas')->nullOnDelete();
            $table->string('status')->default('draft'); // draft | submitted
            $table->timestamp('submitted_at')->nullable();
            // Who last saved it (agency user or superadmin)
            $table->string('updated_by_type')->nullable();
            $table->unsignedBigInteger('updated_by_id')->nullable();
            $table->timestamps();
        });

        Schema::create('application_form_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_form_id')->constrained('application_forms')->cascadeOnDelete();
            $table->foreignId('visa_section_id')->nullable()->constrained('visa_sections')->nullOnDelete();
            $table->foreignId('visa_field_id')->nullable()->constrained('visa_fields')->nullOnDelete();
            $table->string('section_name');
            $table->string('field_name');
            $table->string('field_slug')->nullable();
            $table->text('value')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            // Named by hand: the generated name is over MySQL's 64-character limit
            $table->unique(['application_form_id', 'visa_field_id'], 'app_form_answers_form_field_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_form_answers');
        Schema::dropIfExists('application_forms');
    }
};
