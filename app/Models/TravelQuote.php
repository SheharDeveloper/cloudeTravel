<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TravelQuote extends Model
{
    protected $fillable = [
        'uid',
        'display_name',
        'check_in_date',
        'checkout_date',
        'night',
        'hotel_details',
        'flight_details',
        'visa_details',
        'travel_details',
        'expiry_date',
        'status',
        'half_board',
        'all_inclusive',
        'show_hotel_name',
        'show_individual_price',
        'per_person_pricing',
        'total_price',
        'images',
        'adults',
        'children',
        'infants',
        'price_summary',
    ];

    protected $casts = [
        'hotel_details' => 'array',
        'flight_details' => 'array',
        'visa_details' => 'array',
        'travel_details' => 'array',
        'images' => 'array',
        'check_in_date' => 'date',
        'checkout_date' => 'date',
        'expiry_date' => 'date',
        'status' => 'string',
        'show_hotel_name' => 'boolean',
        'show_individual_price' => 'boolean',
        'per_person_pricing' => 'boolean',
        'total_price' => 'decimal:2',
        'adults' => 'integer',
        'children' => 'integer',
        'infants' => 'integer',
        'price_summary' => 'array',
        'created_at' => 'datetime',
    ];

    protected $appends = ['image_urls'];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->uid) {
                $model->uid = Str::uuid();
            }
        });
    }

    /**
     * Get image URLs - Automatically generates full URLs from stored paths
     */
    public function getImageUrlsAttribute()
    {
        if (!$this->images || !is_array($this->images)) {
            return [];
        }

        return array_map(function ($imagePath) {
            // If path already has /storage/, use as is
            if (strpos($imagePath, '/storage/') === 0) {
                return $imagePath;
            }
            // Otherwise prepend /storage/
            return '/storage/' . $imagePath;
        }, $this->images);
    }

    public function feedback()
    {
        return $this->hasMany(TravelQuoteFeedback::class, 'travel_quote_id');
    }
}
