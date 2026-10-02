<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * "Generate Doc Sign" on a booking: a signing request sent to the
     * client, opened through a secret link (signing_token) on the public
     * Document Signing Portal, where they accept the terms and sign the
     * booking's invoice.
     */
    public function up(): void
    {
        Schema::create('booking_signatures', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('service_booking_id')->unique()->constrained('service_bookings')->cascadeOnDelete();
            $table->string('signing_token', 64)->unique();
            $table->string('signer_name')->nullable();
            $table->string('signer_email')->nullable();
            $table->string('status')->default('pending'); // pending | signed
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('email_sent_at')->nullable();
            $table->unsignedInteger('email_count')->default(0);
            // Filled in when signed
            $table->longText('signature_data')->nullable(); // PNG data URL
            $table->timestamp('terms_accepted_at')->nullable();
            $table->timestamp('signed_at')->nullable();
            $table->string('signed_ip', 45)->nullable();
            $table->string('signed_user_agent')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_signatures');
    }
};
