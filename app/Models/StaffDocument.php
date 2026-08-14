<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffDocument extends Model
{
    protected $table = 'staff_documents';

    protected $fillable = [
        'staffable_type', 'staffable_id', 'owner_type', 'owner_id',
        'document_name', 'document_type', 'file_path', 'file_type',
    ];

    public function staffable()
    {
        return $this->morphTo();
    }

    public function owner()
    {
        return $this->morphTo();
    }
}
