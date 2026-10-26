<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** A staff member's working hours (superadmin or agency staff, through the staffable morph). */
class StaffTiming extends Model
{
    protected $fillable = [
        'staffable_type', 'staffable_id', 'owner_type', 'owner_id',
        'shift_start', 'shift_end', 'lunch_minutes', 'working_days',
    ];

    protected $casts = [
        'lunch_minutes' => 'integer',
        'working_days' => 'integer',
    ];

    public const FIELDS = ['shift_start', 'shift_end', 'lunch_minutes', 'working_days'];

    public function staffable()
    {
        return $this->morphTo();
    }

    /**
     * The owner's default working hours (the row with no staffable): an
     * agency's for agency staff, the superadmin's for superadmin staff.
     */
    public static function defaultFor(?Agency $agency): ?self
    {
        return static::whereNull('staffable_type')
            ->where('owner_type', $agency ? Agency::class : User::class)
            ->when($agency, fn ($q) => $q->where('owner_id', $agency->id))
            ->latest('id')
            ->first();
    }

    /** The default that applies to this staff member. */
    public static function defaultForStaff(User|AgencyUser $staff): ?self
    {
        return static::defaultFor($staff instanceof AgencyUser ? $staff->agency : null);
    }

    /**
     * The hours a staff member actually works to: their own value for each
     * field, or the default where they have none. Null when neither is set.
     */
    public static function effective(?self $own, ?self $default): ?self
    {
        if (! $own && ! $default) {
            return null;
        }
        $timing = new self();
        foreach (self::FIELDS as $field) {
            $timing->{$field} = $own?->{$field} ?? $default?->{$field};
        }

        return $timing;
    }

    /** Shift length in minutes (start → end), or null when no shift is set. */
    public function shiftMinutes(): ?int
    {
        if (! $this->shift_start || ! $this->shift_end) {
            return null;
        }
        [$sh, $sm] = array_map('intval', explode(':', $this->shift_start));
        [$eh, $em] = array_map('intval', explode(':', $this->shift_end));

        return max(($eh * 60 + $em) - ($sh * 60 + $sm), 0);
    }

    /** Paid minutes in a full day: the shift less the lunch allowed. */
    public function workMinutes(): ?int
    {
        $shift = $this->shiftMinutes();

        return $shift === null ? null : max($shift - (int) $this->lunch_minutes, 0);
    }
}
