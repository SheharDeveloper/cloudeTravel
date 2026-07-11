<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Booking extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'uid',
        'type',
        'service',
        'first_name',
        'email',
        'country_code',
        'phone',
        'flight_data',
        'hotel_data',
        'visa_data',
        'package_data',
        'airport_transport_data',
        'visa_type_id',
        'special_offer_id',
        'status',
        'notes',
        // Legacy columns
        'name',
        'country',
        'total_members',
        'travel_date',
        'from_city',
        'to_city',
        'trip_type',
        'return_date',
        'travel_class',
        'destination',
        'passport_country',
        'visa_type',
        'hotel_city',
        'check_in_date',
        'check_out_date',
        'rooms',
        'guests',
    ];

    protected $casts = [
        // JSON columns
        'flight_data' => 'array',
        'hotel_data' => 'array',
        'visa_data' => 'array',
        'package_data' => 'array',
        'airport_transport_data' => 'array',
        // Date columns
        'travel_date' => 'date',
        'return_date' => 'date',
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        // Integer columns
        'total_members' => 'integer',
        'rooms' => 'integer',
        'guests' => 'integer',
        'visa_type_id' => 'integer',
        'special_offer_id' => 'integer',
    ];

    public function notes(): HasMany
    {
        return $this->hasMany(BookingNote::class);
    }

    public function getRouteKeyName()
    {
        return 'uid';
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uid)) {
                $model->uid = Str::uuid();
            }
        });
    }
}
