<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * - visa_fields.options: the choices of a dropdown / radio / checkbox field.
     * - visa_field_assignments.visa_section_id: the section a field is shown in
     *   for one visa ("Move to section" on Assign Field), when it differs from
     *   the field's own section. Other visas are not affected.
     */
    public function up(): void
    {
        Schema::table('visa_fields', function (Blueprint $table) {
            $table->json('options')->nullable()->after('field_type');
        });

        Schema::table('visa_field_assignments', function (Blueprint $table) {
            $table->foreignId('visa_section_id')->nullable()->after('visa_field_id')->constrained('visa_sections')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('visa_field_assignments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('visa_section_id');
        });

        Schema::table('visa_fields', function (Blueprint $table) {
            $table->dropColumn('options');
        });
    }
};
