<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class SpecialOfferImage extends Model
{
    protected $fillable = [
        'uid',
        'special_offer_id',
        'image_path',
        'alt_text',
        'sort_order',
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

    public function specialOffer(): BelongsTo
    {
        return $this->belongsTo(SpecialOffer::class);
    }
}
