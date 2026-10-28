<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * B2B agency registration (Form A): the business details asked of an agency
 * besides its name, address and contact details.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agencies', function (Blueprint $table) {
            $table->string('registration_country')->nullable()->after('country');
            $table->string('contact_name')->nullable()->after('phone_number');
            $table->string('contact_position')->nullable()->after('contact_name');
            $table->unsignedInteger('branches_count')->nullable()->after('registration_number');
            $table->string('preferred_currency', 3)->nullable()->after('branches_count');
            $table->string('expected_monthly_bookings', 20)->nullable()->after('preferred_currency');
            $table->string('payment_terms', 30)->nullable()->after('expected_monthly_bookings');
            $table->boolean('vat_registered')->default(false)->after('payment_terms');
            $table->string('vat_number', 50)->nullable()->after('vat_registered');
            $table->string('authorised_rep_name')->nullable()->after('vat_number');
            $table->string('authorised_rep_position')->nullable()->after('authorised_rep_name');
            $table->timestamp('terms_accepted_at')->nullable()->after('authorised_rep_position');
        });
    }

    public function down(): void
    {
        Schema::table('agencies', function (Blueprint $table) {
            $table->dropColumn([
                'registration_country', 'contact_name', 'contact_position', 'branches_count', 'preferred_currency',
                'expected_monthly_bookings', 'payment_terms', 'vat_registered', 'vat_number',
                'authorised_rep_name', 'authorised_rep_position', 'terms_accepted_at',
            ]);
        });
    }
};
