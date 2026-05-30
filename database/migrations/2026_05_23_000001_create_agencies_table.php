<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('agency_name');
            $table->string('legal_name')->nullable();
            $table->string('email')->unique();
            $table->string('phone_number', 20);
            $table->string('alternate_phone', 20)->nullable();
            $table->string('website', 255)->nullable();
            $table->string('country', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('registration_number', 255)->nullable();
            $table->string('gst_number', 255)->nullable();
            $table->string('pan_number', 255)->nullable();
            $table->string('account_number', 255)->nullable();
            $table->string('ifsc_code', 50)->nullable();
            $table->text('note')->nullable();
            $table->tinyInteger('tax_status')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agencies');
    }
};
