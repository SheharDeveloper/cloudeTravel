<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
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
            'type' => 'required|string|in:flight,hotel,visa,package,transport',
            'first_name' => 'required|string|min:2',
            'email' => 'required|email',
            'country_code' => 'required|string',
            'phone' => 'required|string',
            'status' => 'required|string|in:pending,confirmed,cancelled,completed',
            'flight_data' => 'nullable|array',
            'hotel_data' => 'nullable|array',
            'visa_data' => 'nullable|array',
            'package_data' => 'nullable|array',
            'airport_transport_data' => 'nullable|array',
            'visa_type_id' => 'nullable|integer',
            'special_offer_id' => 'nullable|integer',
        ]);

        try {
            $booking = Booking::create($validated);

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
    public function show(Booking $booking)
    {
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
    public function update(Request $request, Booking $booking)
    {

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
