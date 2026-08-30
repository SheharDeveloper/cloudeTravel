<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Str;
use Spatie\Permission\Traits\HasRoles;

class AgencyUser extends Authenticatable
{
    use HasFactory, HasRoles;

    protected $table = 'agency_users';

    /**
     * Agency users authenticate on their own guard, so Spatie scopes
     * their roles and permissions separately from admin users.
     */
    protected $guard_name = 'agency';

    protected $fillable = [
        'uid',
        'agency_id',
        'name',
        'email',
        'phone',
        'profile_pic',
        'password',
        'is_owner',
        'status',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'is_owner' => 'boolean',
        'password' => 'hashed',
        'email_verified_at' => 'datetime',
    ];

    protected $appends = ['profile_image_url'];

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function staffProfile()
    {
        return $this->morphOne(StaffProfile::class, 'staffable');
    }

    public function staffPayment()
    {
        return $this->morphOne(StaffPayment::class, 'staffable');
    }

    public function staffPassport()
    {
        return $this->morphOne(StaffPassport::class, 'staffable');
    }

    public function staffEmergencyContact()
    {
        return $this->morphOne(StaffEmergencyContact::class, 'staffable');
    }

    public function staffEducations()
    {
        return $this->morphMany(StaffEducation::class, 'staffable');
    }

    public function staffTaxDeductions()
    {
        return $this->morphMany(StaffTaxDeduction::class, 'staffable');
    }

    public function staffDocuments()
    {
        return $this->morphMany(StaffDocument::class, 'staffable');
    }

    public function staffActivityLogs()
    {
        return $this->morphMany(StaffActivityLog::class, 'staffable');
    }

    public function attendances()
    {
        return $this->morphMany(Attendance::class, 'staffable');
    }

    public function attendanceHistories()
    {
        return $this->morphMany(AttendanceHistory::class, 'staffable');
    }

    /**
     * Mirrors the accessor on User so shared layout components can read the
     * same attribute regardless of which guard is authenticated.
     */
    public function getProfileImageUrlAttribute(): ?string
    {
        if (!$this->profile_pic) {
            return null;
        }

        return str_starts_with($this->profile_pic, '/')
            ? $this->profile_pic
            : "/storage/{$this->profile_pic}";
    }

    protected static function booted(): void
    {
        static::creating(function ($agencyUser) {
            if (empty($agencyUser->uid)) {
                $agencyUser->uid = Str::uuid();
            }
        });
    }
}
