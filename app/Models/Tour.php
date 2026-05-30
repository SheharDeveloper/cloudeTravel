<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Tour Model
 * Represents a tour package with all details including itinerary, highlights, and terms
 *
 * Attributes:
 * - name: Tour name/title
 * - image: Tour image path
 * - duration: Tour duration (e.g., "7 Days")
 * - subtitle: Tour subtitle
 * - description: Detailed description
 * - highlights: Tour highlights (JSON)
 * - itinerary: Day-by-day itinerary (JSON)
 * - package_includes: What's included (JSON)
 * - package_excludes: What's not included (JSON)
 * - terms_conditions: Terms and conditions
 * - price: Tour price
 * - location: Tour location
 */
class Tour extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image',
        'duration',
        'subtitle',
        'description',
        'highlights',
        'itinerary',
        'package_includes',
        'package_excludes',
        'terms_conditions',
        'price',
        'location',
    ];

    protected $casts = [
        'highlights' => 'array',
        'itinerary' => 'array',
        'package_includes' => 'array',
        'package_excludes' => 'array',
    ];
}
