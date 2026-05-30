<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactInfo extends Model
{
    use HasFactory;

    protected $table = 'contact_info';

    protected $fillable = [
        'email',
        'phone',
        'location',
        'address',
        'facebook_url',
        'instagram_url',
        'twitter_url',
        'linkedin_url',
        'about_text',
        'logo',
        'get_in_touch_image',
    ];
}
