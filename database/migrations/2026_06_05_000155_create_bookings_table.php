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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('service')->comment('flight, hotel, or visa');
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('country')->nullable();
            $table->integer('total_members')->default(1);
            $table->date('travel_date')->nullable();
            $table->string('from_city')->nullable()->comment('For flights');
            $table->string('to_city')->nullable()->comment('For flights');
            $table->string('trip_type')->nullable()->comment('oneway or roundtrip');
            $table->date('return_date')->nullable()->comment('For round trip flights');
            $table->string('travel_class')->nullable()->comment('Economy, Business, etc');
            $table->string('destination')->nullable()->comment('For visas');
            $table->string('passport_country')->nullable()->comment('For visas');
            $table->string('hotel_city')->nullable()->comment('For hotels');
            $table->date('check_in_date')->nullable()->comment('For hotels');
            $table->date('check_out_date')->nullable()->comment('For hotels');
            $table->integer('rooms')->nullable()->comment('For hotels');
            $table->integer('guests')->nullable()->comment('For hotels');
            $table->text('notes')->nullable();
            $table->string('status')->default('pending')->comment('pending, confirmed, cancelled');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
