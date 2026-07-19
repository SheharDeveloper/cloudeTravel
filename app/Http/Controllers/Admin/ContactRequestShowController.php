<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactRequest;

class ContactRequestShowController extends Controller
{
    public function show(ContactRequest $contact)
    {
        return inertia('Admin/ContactRequests/Show', [
            'contact' => $contact,
        ]);
    }
}
