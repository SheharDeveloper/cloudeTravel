<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffPayment extends Model
{
    protected $table = 'staff_payments';

    protected $fillable = [
        'staffable_type', 'staffable_id', 'owner_type', 'owner_id',
        'salary', 'salary_type', 'currency',
        'bank_name', 'account_number', 'ifsc_code',
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
