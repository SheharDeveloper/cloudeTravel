<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'uid',
        'name',
        'email',
        'password',
        'phone',
        'phone_number',
        'profile_pic',
        'profile_photo',
        'type',
        'parent_id',
        'status',
    ];

    protected $appends = ['profile_image_url'];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(User::class, 'parent_id');
    }

    public function agencies(): HasMany
    {
        return $this->hasMany(Agency::class);
    }

    const DEFAULT_PROFILE_IMAGE = '/images/dummyman.png';

    public function getProfileImageUrl(): string
    {
        if ($this->profile_pic) {
            return str_starts_with($this->profile_pic, '/') ? $this->profile_pic : "/storage/{$this->profile_pic}";
        }
        return self::DEFAULT_PROFILE_IMAGE;
    }

    public function getProfileImageUrlAttribute(): string
    {
        return $this->getProfileImageUrl();
    }

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
