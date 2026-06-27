<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Booking extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'service',
        'name',
        'email',
        'phone',
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
        'notes',
        'status',
    ];

    protected $casts = [
        'travel_date' => 'date',
        'return_date' => 'date',
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'total_members' => 'integer',
        'rooms' => 'integer',
        'guests' => 'integer',
    ];

    public function notes(): HasMany
    {
        return $this->hasMany(BookingNote::class);
    }
}
