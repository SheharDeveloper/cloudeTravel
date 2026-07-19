<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactRequest;
use Illuminate\Http\Request;

class ContactReplyController extends Controller
{
    public function send(Request $request, ContactRequest $contact)
    {
        $validated = $request->validate([
            'message' => 'required|string|min:5|max:5000',
        ]);

        try {
            // TODO: Send email via Mail::raw() to $contact->email
            // Mail::raw($validated['message'], function ($message) use ($contact) {
            //     $message->to($contact->email)
            //         ->subject('Re: ' . $contact->subject);
            // });

            return response()->json([
                'message' => 'Reply sent successfully',
                'success' => true,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send reply',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
