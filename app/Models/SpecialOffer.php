<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class SpecialOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'uid',
        'name',
        'type',
        'description',
        'sub_description',
        'duration_days',
        'duration_nights',
        'total_price',
        'is_active',
        'is_featured',
        'flight_name',
        'flight_origin',
        'flight_destination',
        'hotel_name',
        'hotel_star_rating',
        'hotel_country',
        'hotel_city',
        'visa_name',
        'visa_destination_country',
        'visa_passport_country',
        'visa_type',
        'package_country',
        'package_city',
        'transport_name',
        'transport_type',
        'transport_origin',
        'transport_destination',
        'rating',
        'is_visa',
        'is_transport',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_visa' => 'boolean',
        'is_transport' => 'boolean',
        'total_price' => 'decimal:2',
        'rating' => 'decimal:1',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uid)) {
                $model->uid = Str::uuid();
            }
        });
    }

    public function images(): HasMany
    {
        return $this->hasMany(SpecialOfferImage::class);
    }
}
