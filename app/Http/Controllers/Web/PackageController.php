<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Inertia\Inertia;

class PackageController extends Controller
{
    // Display package details by UUID
    public function show(Package $package)
    {
        return Inertia::render('PackageDetail', [
            'package' => $package,
        ]);
    }
}
