<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 15);
        $service = $request->get('service');
        $status = $request->get('status');

        if ($service && $status) {
            return $this->bookingService->getByServiceAndStatus($service, $status, $perPage);
        } elseif ($service) {
            return $this->bookingService->getByService($service, $perPage);
        } elseif ($status) {
            return $this->bookingService->getByStatus($status, $perPage);
        }

        return $this->bookingService->getAll($perPage);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service' => 'required|string|in:flight,hotel,visa,package,airport-transfer',
            'formData' => 'array',
            'formData.firstName' => 'required_if:service,flight,hotel,visa,package,airport-transfer|string',
            'formData.email' => 'required_if:service,flight,hotel,visa,package,airport-transfer|email',
            'formData.phone' => 'nullable|string',
            'searchParams' => 'array',
        ]);

        try {
            $service = $validated['service'];
            $formData = $validated['formData'] ?? [];
            $searchParams = $validated['searchParams'] ?? [];

            $booking = match ($service) {
                'flight' => $this->bookingService->createFlightBooking($formData, $searchParams),
                'hotel' => $this->bookingService->createHotelBooking($formData, $searchParams),
                'visa' => $this->bookingService->createVisaBooking($formData, $searchParams),
                'package' => $this->bookingService->createPackageBooking($formData, $searchParams),
                'airport-transfer' => $this->bookingService->createAirportTransferBooking($formData, $searchParams),
                default => null,
            };

            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid service type',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Booking submitted successfully',
                'booking' => $booking,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating booking: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $booking = $this->bookingService->getById((int)$id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'booking' => $booking,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $booking = $this->bookingService->getById((int)$id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found',
            ], 404);
        }

        $validated = $request->validate([
            'notes' => 'nullable|string',
            'status' => 'nullable|string|in:pending,confirmed,cancelled',
        ]);

        try {
            $booking->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Booking updated successfully',
                'booking' => $booking,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating booking: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
