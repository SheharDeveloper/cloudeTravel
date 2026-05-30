<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use Inertia\Inertia;

class AgencyController extends Controller
{
    /**
     * Show the edit agency page
     */
    public function edit(Agency $agency)
    {
        return Inertia::render('agency/edit', [
            'agency' => $agency,
        ]);
    }

    /**
     * Show the agency detail page
     */
    public function show(Agency $agency)
    {
        return Inertia::render('agency/show', [
            'agency' => $agency,
        ]);
    }
}
