<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Visa;
use Inertia\Inertia;

class VisaController extends Controller
{
    /**
     * Show the visa detail page
     */
    public function show(Visa $visa)
    {
        return Inertia::render('visas/visa-detail', [
            'visa' => $visa,
        ]);
    }
}
