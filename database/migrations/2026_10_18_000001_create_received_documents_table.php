<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Client Documents: the physical documents a client hands to the agency
     * (passport, travel document…) — when they were received, remarks, when
     * they were returned, and when the client was last notified. Belongs to
     * the agency (or superadmin) that owns the client.
     */
    public function up(): void
    {
        Schema::create('received_documents', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->string('owner_type')->nullable();
            $table->unsignedBigInteger('owner_id')->nullable();
            $table->string('document_name');
            $table->dateTime('received_at');
            $table->text('remarks')->nullable();
            // Given back to the client, with a message about the return
            $table->dateTime('returned_at')->nullable();
            $table->text('return_remarks')->nullable();
            // "Send Notification": the last email / portal notice to the client
            $table->timestamp('notified_at')->nullable();
            $table->unsignedInteger('notification_count')->default(0);
            $table->string('created_by_type')->nullable();
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->timestamps();

            $table->index(['owner_type', 'owner_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('received_documents');
    }
};
