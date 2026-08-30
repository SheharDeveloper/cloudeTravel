<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Communication extends Model
{
    protected $table = 'communications';

    protected $fillable = [
        'communicable_type', 'communicable_id', 'causer_type', 'causer_id', 'description',
    ];

    /**
     * The record this communication is about: currently always App\Models\Client
     */
    public function communicable()
    {
        return $this->morphTo();
    }

    /**
     * Who logged this communication: App\Models\User or App\Models\AgencyUser
     */
    public function causer()
    {
        return $this->morphTo();
    }
}
