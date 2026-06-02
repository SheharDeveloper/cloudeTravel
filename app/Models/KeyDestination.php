<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KeyDestination extends Model
{
    protected $table = 'key_destinations';

    protected $fillable = [
        'tour_id',
        'destination_name',
        'location',
        'description',
    ];

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }
}
