<?php

namespace App\Http\Controllers\Web;

use Illuminate\Routing\Controller;
use Inertia\Inertia;

class OfferController extends Controller
{
    public function show($uid)
    {
        return Inertia::render('OfferDetail', [
            'uid' => $uid,
            'currency' => config('currency')
        ]);
    }
}
