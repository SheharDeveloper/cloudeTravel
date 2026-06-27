<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Package extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uid',
        'name',
        'title',
        'description',
        'image',
        'price',
        'currency',
        'origin_country',
        'destination_country',
        'hotel_name',
        'hotel_stars',
        'duration_days',
        'travel_export_included',
        'visa_service_included',
        'status',
        'is_featured',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'hotel_stars' => 'integer',
        'duration_days' => 'integer',
        'travel_export_included' => 'boolean',
        'visa_service_included' => 'boolean',
        'status' => 'boolean',
        'is_featured' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
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
}
