<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * - application_form_logs: "Visa Updation Log Data" — every change made to
     *   a submitted application form, field by field (old and new value), and
     *   who made it (the agency or the admin).
     * - booking_applications.updated_after_send_at: the agency changed the
     *   application after sending it to the admin, so it has to be resent.
     */
    public function up(): void
    {
        Schema::create('application_form_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_application_id')->constrained('booking_applications')->cascadeOnDelete();
            $table->foreignId('visa_field_id')->nullable()->constrained('visa_fields')->nullOnDelete();
            $table->string('section_name')->nullable();
            $table->string('field_name');
            $table->string('field_slug')->nullable();
            $table->text('old_value')->nullable();
            $table->text('new_value')->nullable();
            // A note with the change, e.g. the reason an application was rejected
            $table->text('comment')->nullable();
            $table->string('changed_by_role'); // agency | admin
            $table->string('changed_by_type')->nullable();
            $table->unsignedBigInteger('changed_by_id')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index(['booking_application_id', 'created_at']);
        });

        Schema::table('booking_applications', function (Blueprint $table) {
            $table->timestamp('updated_after_send_at')->nullable()->after('sent_by_id');
        });
    }

    public function down(): void
    {
        Schema::table('booking_applications', function (Blueprint $table) {
            $table->dropColumn('updated_after_send_at');
        });

        Schema::dropIfExists('application_form_logs');
    }
};
