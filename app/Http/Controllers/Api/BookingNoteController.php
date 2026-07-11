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
    public function index(Booking $booking): JsonResponse
    {
        $notes = $booking->notes()->latest()->get();

        return response()->json([
            'success' => true,
            'notes' => $notes,
        ]);
    }

    /**
     * Store a new note for a booking
     */
    public function store(Request $request, Booking $booking): JsonResponse
    {
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
    public function destroy(Booking $booking, BookingNote $note): JsonResponse
    {
        if ($note->booking_id !== $booking->id) {
            return response()->json([
                'success' => false,
                'message' => 'Note does not belong to this booking',
            ], 403);
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
