<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisaDocument extends Model
{
    protected $fillable = ['visa_id', 'name', 'description', 'is_required', 'sort_order'];

    protected $casts = ['is_required' => 'boolean', 'sort_order' => 'integer'];

    public function visa()
    {
        return $this->belongsTo(Visa::class);
    }
}
