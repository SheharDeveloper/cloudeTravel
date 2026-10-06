<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * "Upload Document": the documents the superadmin requests for one
     * application (name, description, required), and the file the agency
     * (or the superadmin) uploads for each. One file per request; uploading
     * again replaces it.
     */
    public function up(): void
    {
        Schema::create('application_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_application_id')->constrained('booking_applications')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_required')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('requested_by_type')->nullable();
            $table->unsignedBigInteger('requested_by_id')->nullable();

            // The uploaded file, once there is one
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('uploaded_by_role')->nullable(); // agency | admin
            $table->string('uploaded_by_type')->nullable();
            $table->unsignedBigInteger('uploaded_by_id')->nullable();
            $table->timestamp('uploaded_at')->nullable();
            // The copy saved in the client's Documents (a folder named after the visa)
            $table->foreignId('client_document_id')->nullable()->constrained('client_documents')->nullOnDelete();

            // The superadmin's review of the uploaded file: approved (correct) or
            // rejected (not correct, with the reason); null = waiting for review.
            // A new upload clears the review.
            $table->string('review_status')->nullable(); // approved | rejected
            $table->text('review_note')->nullable();
            $table->string('reviewed_by_type')->nullable();
            $table->unsignedBigInteger('reviewed_by_id')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['booking_application_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_documents');
    }
};
