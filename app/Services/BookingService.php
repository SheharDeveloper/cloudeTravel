<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Pagination\LengthAwarePaginator;

class BookingService
{
    protected Booking $model;

    public function __construct(Booking $model)
    {
        $this->model = $model;
    }

    /**
     * Get all bookings with pagination
     */
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->latest()->paginate($perPage);
    }

    /**
     * Get bookings by service type
     */
    public function getByService(string $service, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->where('service', $service)
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get bookings by status
     */
    public function getByStatus(string $status, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->where('status', $status)
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get bookings by both service and status
     */
    public function getByServiceAndStatus(string $service, string $status, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->where('service', $service)
            ->where('status', $status)
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Create a new booking
     */
    public function create(array $data): Booking
    {
        return $this->model->create($data);
    }

    /**
     * Create flight booking
     */
    public function createFlightBooking(array $formData, array $searchParams): Booking
    {
        $data = [
            'service' => 'flight',
            'name' => $this->formatName($formData['firstName'], $formData['lastName']),
            'email' => $formData['email'],
            'phone' => $formData['phone'] ?? null,
            'country' => $searchParams['fromCity'] ?? null,
            'total_members' => $searchParams['adults'] + $searchParams['children'] + $searchParams['infants'],
            'travel_date' => $searchParams['departureDate'] ?? null,
            'from_city' => $searchParams['fromCity'] ?? null,
            'to_city' => $searchParams['toCity'] ?? null,
            'trip_type' => $searchParams['tripType'] ?? null,
            'return_date' => $searchParams['returnDate'] ?? null,
            'travel_class' => $searchParams['selectedClass'] ?? null,
            'notes' => $this->generateFlightNotes($searchParams),
            'status' => 'pending',
        ];

        return $this->create($data);
    }

    /**
     * Create hotel booking
     */
    public function createHotelBooking(array $formData, array $searchParams): Booking
    {
        $data = [
            'service' => 'hotel',
            'name' => $this->formatName($formData['firstName'], $formData['lastName']),
            'email' => $formData['email'],
            'phone' => $formData['phone'] ?? null,
            'country' => $searchParams['city'] ?? null,
            'total_members' => $searchParams['guests'] ?? 1,
            'hotel_city' => $searchParams['city'] ?? null,
            'check_in_date' => $searchParams['checkInDate'] ?? null,
            'check_out_date' => $searchParams['checkOutDate'] ?? null,
            'rooms' => $searchParams['rooms'] ?? 1,
            'guests' => $searchParams['guests'] ?? 1,
            'notes' => $this->generateHotelNotes($searchParams),
            'status' => 'pending',
        ];

        return $this->create($data);
    }

    /**
     * Create visa booking
     */
    public function createVisaBooking(array $formData, array $searchParams): Booking
    {
        $data = [
            'service' => 'visa',
            'name' => $this->formatName($formData['firstName'], $formData['lastName']),
            'email' => $formData['email'],
            'phone' => $formData['phone'] ?? null,
            'country' => $searchParams['destination'] ?? null,
            'travel_date' => $searchParams['travelDate'] ?? null,
            'destination' => $searchParams['destination'] ?? null,
            'passport_country' => $searchParams['passportCountry'] ?? null,
            'notes' => $this->generateVisaNotes($searchParams),
            'status' => 'pending',
        ];

        return $this->create($data);
    }

    /**
     * Update booking status
     */
    public function updateStatus(Booking $booking, string $status): Booking
    {
        $booking->update(['status' => $status]);
        return $booking;
    }

    /**
     * Get booking by id
     */
    public function getById(int $id): ?Booking
    {
        return $this->model->find($id);
    }

    /**
     * Delete booking
     */
    public function delete(Booking $booking): bool
    {
        return $booking->delete();
    }

    /**
     * Format full name from first and last name
     */
    private function formatName(string $firstName, string $lastName): string
    {
        return trim("{$firstName} {$lastName}");
    }

    /**
     * Generate flight booking notes
     */
    private function generateFlightNotes(array $searchParams): string
    {
        return sprintf(
            'Trip Type: %s, Adults: %d, Children: %d, Infants: %d, Class: %s',
            $searchParams['tripType'] ?? 'N/A',
            $searchParams['adults'] ?? 0,
            $searchParams['children'] ?? 0,
            $searchParams['infants'] ?? 0,
            $searchParams['selectedClass'] ?? 'N/A'
        );
    }

    /**
     * Generate hotel booking notes
     */
    private function generateHotelNotes(array $searchParams): string
    {
        return sprintf(
            'Rooms: %d, Guests: %d',
            $searchParams['rooms'] ?? 1,
            $searchParams['guests'] ?? 1
        );
    }

    /**
     * Generate visa booking notes
     */
    private function generateVisaNotes(array $searchParams): string
    {
        return sprintf(
            'Passport Country: %s, Destination: %s',
            $searchParams['passportCountry'] ?? 'N/A',
            $searchParams['destination'] ?? 'N/A'
        );
    }
}
