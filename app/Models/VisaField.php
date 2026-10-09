<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisaField extends Model
{
    protected $fillable = ['visa_section_id', 'field_name', 'slug', 'field_type', 'options', 'status'];

    protected $casts = ['status' => 'boolean', 'options' => 'array'];

    /** The types a field can have (Assign Field → Add / Edit field). */
    public const TYPES = [
        'text' => 'Text',
        'textarea' => 'Long Text',
        'number' => 'Number',
        'email' => 'Email',
        'tel' => 'Phone',
        'date' => 'Date',
        'select' => 'Dropdown',
        'radio' => 'Radio Buttons',
        'checkbox' => 'Checkboxes',
        'yesno' => 'Yes / No',
        'country' => 'Country',
        'file' => 'File Upload',
    ];

    /** Types that need a list of options. */
    public const CHOICE_TYPES = ['select', 'radio', 'checkbox'];

    /**
     * A Yes / No field can open a follow-up section (e.g. "Reason") when it is
     * answered Yes — or No. Its options then hold
     * ['show_when' => 'Yes'|'No', 'fields' => [['name', 'type', 'required'], …]];
     * these are the types the follow-up fields can have.
     */
    public const FOLLOW_UP_TYPES = [
        'text' => 'Text',
        'textarea' => 'Long Text',
        'number' => 'Number',
        'email' => 'Email',
        'tel' => 'Phone',
        'date' => 'Date',
        'country' => 'Country',
    ];

    public function section()
    {
        return $this->belongsTo(VisaSection::class, 'visa_section_id');
    }

    public function fieldAssignments()
    {
        return $this->hasMany(VisaFieldAssignment::class);
    }
}
