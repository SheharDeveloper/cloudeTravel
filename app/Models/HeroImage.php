<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeroImage extends Model
{
    use HasFactory;

    protected $table = 'hero_images';

    protected $fillable = [
        'image_url',
        'title',
        'subtitle',
        'status',
        'order',
        'recorder',
    ];
}
