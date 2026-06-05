<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingNote;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BookingNoteController extends Controller
{
    /**
     * Get all notes for a booking
     */
    public function index(string $bookingId): JsonResponse
    {
        $booking = Booking::find($bookingId);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found',
            ], 404);
        }

        $notes = $booking->notes()->latest()->get();

        return response()->json([
            'success' => true,
            'notes' => $notes,
        ]);
    }

    /**
     * Store a new note for a booking
     */
    public function store(Request $request, string $bookingId): JsonResponse
    {
        $booking = Booking::find($bookingId);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found',
            ], 404);
        }

        $validated = $request->validate([
            'note' => 'required|string',
            'user_name' => 'nullable|string',
            'user_email' => 'nullable|email',
        ]);

        try {
            $note = $booking->notes()->create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Note added successfully',
                'note' => $note,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating note: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a note
     */
    public function destroy(string $bookingId, string $noteId): JsonResponse
    {
        $booking = Booking::find($bookingId);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found',
            ], 404);
        }

        $note = $booking->notes()->find($noteId);

        if (!$note) {
            return response()->json([
                'success' => false,
                'message' => 'Note not found',
            ], 404);
        }

        try {
            $note->delete();

            return response()->json([
                'success' => true,
                'message' => 'Note deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting note: ' . $e->getMessage(),
            ], 500);
        }
    }
}
