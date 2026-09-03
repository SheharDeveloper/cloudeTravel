<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ContactInfo extends Model
{
    use HasFactory;

    protected $table = 'contact_info';

    protected $fillable = [
        'uid',
        'owner_type',
        'owner_id',
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
        'loader_video',
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
     * Who this contact info belongs to: App\Models\Agency or App\Models\User
     */
    public function owner()
    {
        return $this->morphTo();
    }
}
