<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tour extends Model
{
    protected $fillable = [
        'tour_title',
        'hero_title',
        'hero_subtitle',
        'short_description',
        'full_description',
        'country',
        'city',
        'duration_days',
        'start_date',
        'end_date',
        'status',
        'featured',
        'early_booking_price_text',
        'feature_image',
        'banner_images',
    ];

    protected $casts = [
        'banner_images' => 'json',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function highlights(): HasMany
    {
        return $this->hasMany(Highlight::class);
    }

    public function itineraries(): HasMany
    {
        return $this->hasMany(Itinerary::class);
    }

    public function keyDestinations(): HasMany
    {
        return $this->hasMany(KeyDestination::class);
    }

    public function termsConditions(): HasMany
    {
        return $this->hasMany(TermsCondition::class);
    }
}
