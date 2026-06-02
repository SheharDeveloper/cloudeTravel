<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Itinerary extends Model
{
    protected $fillable = [
        'tour_id',
        'day',
        'date',
        'title',
        'location',
        'description',
        'images',
        'short_order',
    ];

    protected $casts = [
        'images' => 'json',
        'date' => 'date',
        'day' => 'integer',
        'short_order' => 'integer',
    ];

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }
}
