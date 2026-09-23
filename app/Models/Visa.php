<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Visa extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uid',
        'visa_type_id',
        'origin_country_id',
        'destination_country_id',
        'visa_service_category_id',
        'name',
        'title',
        'description',
        'image',
        'status',
        'is_featured',
    ];

    protected $casts = [
        'status' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function getRouteKeyName()
    {
        return 'uid';
    }

    public function visaType()
    {
        return $this->belongsTo(VisaType::class);
    }

    public function originCountry()
    {
        return $this->belongsTo(Country::class, 'origin_country_id');
    }

    public function destinationCountry()
    {
        return $this->belongsTo(Country::class, 'destination_country_id');
    }

    public function category()
    {
        return $this->belongsTo(VisaServiceCategory::class, 'visa_service_category_id');
    }

    public function costDetails()
    {
        return $this->hasMany(VisaCostDetail::class);
    }

    public function sectionAssignments()
    {
        return $this->hasMany(VisaSectionAssignment::class);
    }

    public function documents()
    {
        return $this->hasMany(VisaDocument::class);
    }

    public function fieldAssignments()
    {
        return $this->hasMany(VisaFieldAssignment::class);
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
