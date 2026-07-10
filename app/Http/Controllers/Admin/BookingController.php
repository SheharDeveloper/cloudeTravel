<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 15);
        $page = $request->get('page', 1);
        $service = $request->get('service');
        $status = $request->get('status');
        $search = $request->get('search');

        $bookings = $this->bookingService->getForAdmin($perPage, $page, $service, $status, $search);

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings->items(),
            'current_page' => $bookings->currentPage(),
            'last_page' => $bookings->lastPage(),
            'filters' => [
                'search' => $search,
                'service' => $service,
                'status' => $status,
            ],
        ]);
    }
}
