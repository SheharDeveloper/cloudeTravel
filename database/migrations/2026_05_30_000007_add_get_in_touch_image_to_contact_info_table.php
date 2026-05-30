<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_info', function (Blueprint $table) {
            $table->string('get_in_touch_image')->nullable()->after('logo');
        });
    }

    public function down(): void
    {
        Schema::table('contact_info', function (Blueprint $table) {
            $table->dropColumn('get_in_touch_image');
        });
    }
};
