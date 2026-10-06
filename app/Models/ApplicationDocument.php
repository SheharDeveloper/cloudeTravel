<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** A document the superadmin requested for an application, and the file uploaded for it (Upload Document). */
class ApplicationDocument extends Model
{
    public const ROLE_AGENCY = 'agency';
    public const ROLE_ADMIN = 'admin';

    // The superadmin's review of the uploaded file (null: waiting for review)
    public const REVIEW_APPROVED = 'approved';
    public const REVIEW_REJECTED = 'rejected';

    protected $fillable = [
        'booking_application_id', 'name', 'description', 'is_required', 'sort_order',
        'requested_by_type', 'requested_by_id',
        'file_path', 'file_name', 'mime_type', 'file_size',
        'uploaded_by_role', 'uploaded_by_type', 'uploaded_by_id', 'uploaded_at', 'client_document_id',
        'review_status', 'review_note', 'reviewed_by_type', 'reviewed_by_id', 'reviewed_at',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'sort_order' => 'integer',
        'file_size' => 'integer',
        'uploaded_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function application()
    {
        return $this->belongsTo(BookingApplication::class, 'booking_application_id');
    }
}
