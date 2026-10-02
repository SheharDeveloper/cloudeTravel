<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** One answered field of an application form, with its section and field names as answered. */
class ApplicationFormAnswer extends Model
{
    protected $fillable = [
        'application_form_id', 'visa_section_id', 'visa_field_id',
        'section_name', 'field_name', 'field_slug', 'value', 'sort_order',
    ];

    public function form()
    {
        return $this->belongsTo(ApplicationForm::class, 'application_form_id');
    }
}
