<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class HeroImage extends Model
{
    use HasFactory;

    protected $table = 'hero_images';

    protected $fillable = [
        'uid',
        'image_url',
        'title',
        'subtitle',
        'status',
        'order',
        'recorder',
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
