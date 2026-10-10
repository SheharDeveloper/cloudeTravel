<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** One changed field of a submitted application form (Visa Updation Log Data). */
class ApplicationFormLog extends Model
{
    public const UPDATED_AT = null;

    public const ROLE_AGENCY = 'agency';
    public const ROLE_ADMIN = 'admin';

    protected $fillable = [
        'booking_application_id', 'visa_field_id', 'section_name', 'field_name', 'field_slug',
        'old_value', 'new_value', 'comment', 'changed_by_role', 'changed_by_type', 'changed_by_id',
    ];

    public function application()
    {
        return $this->belongsTo(BookingApplication::class, 'booking_application_id');
    }
}
