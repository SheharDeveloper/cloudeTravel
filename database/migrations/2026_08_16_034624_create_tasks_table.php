<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            // Who this task belongs to: App\Models\Agency, or null for a
            // superadmin-side task.
            $table->nullableMorphs('owner');
            $table->string('title', 255);
            $table->text('details')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->date('due_date')->nullable();
            $table->enum('status', ['todo', 'in_progress', 'review', 'done'])->default('todo');
            // When the status last changed — drives the board's "done
            // today only" filter and the history section below it.
            $table->timestamp('status_updated_at')->nullable();
            $table->text('remark')->nullable();
            // Who the task is assigned to: App\Models\User or App\Models\AgencyUser.
            $table->nullableMorphs('assigned_to');
            // Who created the task: App\Models\User or App\Models\AgencyUser.
            $table->morphs('created_by');
            $table->timestamps();
        });

        Schema::create('task_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->string('file_name', 255);
            $table->string('file_path', 255);
            $table->string('file_type', 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_attachments');
        Schema::dropIfExists('tasks');
    }
};
