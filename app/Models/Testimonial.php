<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'uid',
        'owner_type',
        'owner_id',
        'client_name',
        'client_image',
        'message',
        'rating',
        'status',
        'order',
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

    /**
     * Who this testimonial belongs to: App\Models\Agency or App\Models\User
     */
    public function owner()
    {
        return $this->morphTo();
    }
}
