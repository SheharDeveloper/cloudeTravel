<?php

namespace App\Http\Controllers;

use App\Services\BookingService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function index()
    {
        return Inertia::render('dashboard', [
            'stats' => $this->bookingService->getStats(),
            'bookings' => $this->bookingService->getForAdmin(10)->items(),
        ]);
    }
}
