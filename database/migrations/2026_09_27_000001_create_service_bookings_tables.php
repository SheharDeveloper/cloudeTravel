<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Bookings made from the admin side for any service (visa, flight,
     * hotel…): one row per booking with its invoice number, and one
     * application per passenger with their relation to the client. The
     * website enquiry `bookings` table is separate.
     */
    public function up(): void
    {
        Schema::create('service_bookings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            // INV000001 — set from the id right after the row is created
            $table->string('invoice_number')->nullable()->unique();
            $table->string('service');
            // The agency (or superadmin) that made it
            $table->string('owner_type')->nullable();
            $table->unsignedBigInteger('owner_id')->nullable();
            $table->foreignId('client_id')->nullable()->constrained('clients')->nullOnDelete();
            // Date of entry for a visa, travel / check-in date for others
            $table->date('service_date')->nullable();
            $table->unsignedInteger('passengers')->default(1);
            $table->string('currency_code', 10);
            $table->string('currency_symbol', 10);
            // Totals for all passengers
            $table->decimal('base_amount', 12, 2)->default(0);
            $table->decimal('service_fee', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            // What was booked, as shown at the time (visa name, type, validity…)
            $table->json('details')->nullable();
            // Printed on the invoice: formatted text of up to 500 characters, cleaned before saving
            $table->text('invoice_remark')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();

            $table->index(['owner_type', 'owner_id']);
            $table->index('service');
        });

        Schema::create('booking_applications', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('service_booking_id')->constrained('service_bookings')->cascadeOnDelete();
            $table->foreignId('client_family_member_id')->nullable()->constrained('client_family_members')->nullOnDelete();
            $table->string('relation');
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->string('passport_number')->nullable();
            $table->string('nationality')->nullable();
            $table->string('phone')->nullable();
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_applications');
        Schema::dropIfExists('service_bookings');
    }
};
