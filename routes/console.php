<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Checks out any staff member whose shift time is up — even with the browser closed
Artisan::command('attendance:auto-checkout', function () {
    $count = app(\App\Services\AttendanceService::class)->enforceAllTimeLimits();
    $this->info("Checked out {$count} staff member(s).");
})->purpose('Check out staff whose shift time limit has passed');

Schedule::command('attendance:auto-checkout')->everyMinute();
