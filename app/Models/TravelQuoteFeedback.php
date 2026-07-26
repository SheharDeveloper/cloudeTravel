<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TravelQuoteFeedback extends Model
{
    protected $table = 'travel_quote_feedback';

    protected $fillable = [
        'uid',
        'travel_quote_id',
        'name',
        'email',
        'phone_number',
        'status',
        'reason',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->uid) {
                $model->uid = Str::uuid();
            }
        });
    }

    public function travelQuote()
    {
        return $this->belongsTo(TravelQuote::class, 'travel_quote_id');
    }
}
