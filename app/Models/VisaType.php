<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisaType extends Model
{
    protected $table = 'visa_types';

    protected $fillable = [
        'name',
        'description',
    ];
}
