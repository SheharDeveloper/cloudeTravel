<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\AgencyUser;
use App\Models\Attendance;
use App\Models\AttendanceExtension;
use App\Models\AttendanceHistory;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;

class AttendanceService
{
    /** Each staff member's working hours (their own, falling back to the default), once per request. */
    private array $timings = [];

    /**
     * The currently authenticated principal, whichever guard signed them in.
     */
    public function currentPrincipal(): User|AgencyUser|null
    {
        return Auth::guard('agency')->user() ?? Auth::guard('web')->user();
    }

    /**
     * Only individual staff are gated by attendance — not the superadmin
     * and not an agency's own owner login.
     */
    public function isStaff(User|AgencyUser $principal): bool
    {
        if ($principal instanceof AgencyUser) {
            return !$principal->is_owner;
        }

        return $principal->type === 'staff';
    }

    private function staffableAttributes(User|AgencyUser $staff): array
    {
        return [
            'staffable_type' => get_class($staff),
            'staffable_id' => $staff->id,
        ];
    }

    /**
     * Owner attributes stamped on the attendance row: the staff member's
     * own agency, or null for a superadmin-side staff account.
     */
    private function ownerAttributes(User|AgencyUser $staff): array
    {
        if ($staff instanceof AgencyUser) {
            return [
                'owner_type' => Agency::class,
                'owner_id' => $staff->agency_id,
            ];
        }

        return [
            'owner_type' => null,
            'owner_id' => null,
        ];
    }

    /**
     * Append an event to the staff member's attendance history. Causer is
     * whoever is currently signed in — the staff themselves for self-service
     * actions (check-in, lunch, leave application), or the admin/owner for
     * corrections and leave decisions.
     */
    private function logHistory(
        User|AgencyUser $staff,
        string $date,
        string $event,
        ?string $status = null,
        ?string $workType = null,
        ?string $notes = null,
        ?\DateTimeInterface $occurredAt = null,
        ?string $batchId = null,
        ?int $leaveTypeId = null
    ): AttendanceHistory {
        $causer = $this->currentPrincipal();

        return AttendanceHistory::create(
            $this->staffableAttributes($staff) + $this->ownerAttributes($staff) + [
                'date' => $date,
                'event' => $event,
                'batch_id' => $batchId,
                'leave_type_id' => $leaveTypeId,
                'status' => $status,
                'work_type' => $workType,
                'occurred_at' => $occurredAt ?? Date::now(),
                'notes' => $notes,
                'causer_type' => $causer ? get_class($causer) : null,
                'causer_id' => $causer?->id,
            ]
        );
    }

    /**
     * Owner attributes for the CURRENT session (not a specific staff
     * member) — used for scoping leave types, which belong to whichever
     * agency/superadmin is managing them.
     */
    private function currentOwnerAttributes(): array
    {
        $agency = Auth::guard('agency')->user()?->agency;

        return [
            'owner_type' => $agency ? Agency::class : null,
            'owner_id' => $agency?->id,
        ];
    }

    /**
     * Leave types configured for the current session: an agency sees only
     * its own, a superadmin sees its own.
     */
    public function leaveTypesForCurrentSession(): Collection
    {
        $owner = $this->currentOwnerAttributes();

        return LeaveType::where('owner_type', $owner['owner_type'])
            ->where('owner_id', $owner['owner_id'])
            ->orderBy('name')
            ->get();
    }

    /**
     * Fetch a leave type the current session is allowed to manage.
     */
    public function findLeaveType(int $id): LeaveType
    {
        $owner = $this->currentOwnerAttributes();

        return LeaveType::where('id', $id)
            ->where('owner_type', $owner['owner_type'])
            ->where('owner_id', $owner['owner_id'])
            ->firstOrFail();
    }

    public function createLeaveType(string $name, int $days): LeaveType
    {
        return LeaveType::create($this->currentOwnerAttributes() + [
            'name' => $name,
            'days' => $days,
        ]);
    }

    public function updateLeaveType(LeaveType $type, string $name, int $days): LeaveType
    {
        $type->update(['name' => $name, 'days' => $days]);

        return $type;
    }

    public function deleteLeaveType(LeaveType $type): bool
    {
        return (bool) $type->delete();
    }

    public function hasMarkedToday(User|AgencyUser $staff): bool
    {
        return $this->todayFor($staff) !== null;
    }

    public function todayFor(User|AgencyUser $staff): ?Attendance
    {
        return Attendance::where($this->staffableAttributes($staff))
            ->whereDate('date', Date::today())
            ->first();
    }

    public function markAttendance(User|AgencyUser $staff): Attendance
    {
        $attendance = Attendance::firstOrCreate(
            $this->staffableAttributes($staff) + ['date' => Date::today()->toDateString()],
            $this->ownerAttributes($staff) + ['checked_in_at' => Date::now()]
        );

        if ($attendance->wasRecentlyCreated) {
            $this->logHistory($staff, Date::today()->toDateString(), 'check_in', 'present');
        }

        return $attendance;
    }

    public function checkOut(User|AgencyUser $staff): ?Attendance
    {
        $today = $this->todayFor($staff);

        if ($today && !$today->checked_out_at) {
            $today->update(['checked_out_at' => Date::now()]);
            $this->logHistory($staff, Date::today()->toDateString(), 'check_out');
        }

        return $today;
    }

    /**
     * When the staff member's working day ends on a date: their shift's End
     * time (Staff Settings — their own or the default) plus any time an admin
     * has extended it by. A shift ending at or before its start ends the next
     * day. Null when no end time is set.
     */
    public function endsAt(User|AgencyUser $staff, ?string $date = null): ?\Carbon\CarbonInterface
    {
        $timing = $this->timingFor($staff);
        if (! $timing?->shift_end) {
            return null;
        }
        $date ??= Date::today()->toDateString();
        $end = Date::parse("{$date} {$timing->shift_end}");
        if ($timing->shift_start && $timing->shift_end <= $timing->shift_start) {
            $end = $end->addDay();
        }

        return $end->addMinutes($this->extensionMinutes($staff, $date));
    }

    /** Minutes an admin has extended the staff member's day by. */
    public function extensionMinutes(User|AgencyUser $staff, string $date): int
    {
        return (int) AttendanceExtension::where($this->staffableAttributes($staff))
            ->whereDate('date', $date)
            ->value('minutes');
    }

    /** When a checked-in staff member is checked out automatically; null once they've checked out. */
    public function deadlineFor(User|AgencyUser $staff, ?Attendance $attendance): ?\Carbon\CarbonInterface
    {
        if (! $attendance?->checked_in_at || $attendance->checked_out_at) {
            return null;
        }

        return $this->endsAt($staff, $attendance->date->toDateString());
    }

    /**
     * Checks the staff member out once their working day has ended, at the
     * moment it ended (not whenever this happens to run) — or at check-in,
     * if they somehow checked in after it. True when it did.
     */
    public function enforceTimeLimit(User|AgencyUser $staff, ?Attendance $attendance = null): bool
    {
        $attendance ??= $this->openAttendance($staff);
        $deadline = $this->deadlineFor($staff, $attendance);
        if (! $deadline || Date::now()->lessThan($deadline)) {
            return false;
        }
        $at = $deadline->greaterThan($attendance->checked_in_at) ? $deadline : $attendance->checked_in_at;

        $attendance->update(['checked_out_at' => $at, 'auto_checked_out_at' => Date::now()]);
        $this->logHistory(
            $staff,
            $attendance->date->toDateString(),
            'check_out',
            notes: 'Checked out automatically: working hours ended',
            occurredAt: $at
        );

        return true;
    }

    /** Everyone whose working day has ended and is still checked in — for the scheduler. */
    public function enforceAllTimeLimits(): int
    {
        $count = 0;
        Attendance::whereNull('checked_out_at')->whereNotNull('checked_in_at')->get()
            ->each(function (Attendance $attendance) use (&$count) {
                if ($attendance->staffable && $this->enforceTimeLimit($attendance->staffable, $attendance)) {
                    $count++;
                }
            });

        return $count;
    }

    /**
     * For the signed-in staff member's popup: when today's time runs out,
     * and whether they've been checked out because it did.
     */
    public function timeLimitState(User|AgencyUser $staff): ?array
    {
        $this->enforceTimeLimit($staff);
        $today = $this->todayFor($staff);
        if (! $today) {
            return null;
        }
        $deadline = $this->deadlineFor($staff, $today);

        return [
            'deadline' => $deadline?->toIso8601String(),
            'deadline_label' => $deadline?->format('h:i A'),
            'auto_checked_out' => $today->auto_checked_out_at !== null,
            'checked_out_label' => $today->checked_out_at?->format('h:i A'),
            'date' => $today->date->toDateString(),
            'now' => Date::now()->toIso8601String(),
        ];
    }

    /**
     * An admin gives a staff member more time today, past their shift's end:
     * their day now ends that many minutes from now (or from when it was due
     * to end, if that's still ahead). If they'd checked out they're checked
     * back in; if they hadn't checked in yet, they can now sign in and do.
     */
    public function extendDay(User|AgencyUser $staff, int $minutes, ?string $grantedBy = null): void
    {
        $date = Date::today()->toDateString();
        $shiftEnd = $this->endsAt($staff, $date)?->subMinutes($this->extensionMinutes($staff, $date));
        abort_unless($shiftEnd, 422, 'Set working hours for this staff member first (Staff Settings).');

        $dueAt = $shiftEnd->copy()->addMinutes($this->extensionMinutes($staff, $date));
        $from = $dueAt->greaterThan(Date::now()) ? $dueAt : Date::now();
        $total = max((int) ceil($shiftEnd->diffInMinutes($from->copy()->addMinutes($minutes))), 0);

        AttendanceExtension::updateOrCreate(
            $this->staffableAttributes($staff) + ['date' => $date],
            $this->ownerAttributes($staff) + ['minutes' => $total, 'granted_by' => $grantedBy]
        );

        if ($attendance = $this->todayFor($staff)) {
            $attendance->update(['checked_out_at' => null, 'auto_checked_out_at' => null]);
        }
        $this->logHistory($staff, $date, 'time_extended', notes: "Extended by {$minutes} min");
    }

    /** When the staff member's working day ends today without any extension (their shift's End time). */
    public function shiftEndsAt(User|AgencyUser $staff): ?\Carbon\CarbonInterface
    {
        $date = Date::today()->toDateString();

        return $this->endsAt($staff, $date)?->subMinutes($this->extensionMinutes($staff, $date));
    }

    /**
     * An admin changes today's extension so the day ends at $until (after
     * the shift's End time). A checked-out staff member is checked back in
     * when that's still ahead.
     */
    public function setExtensionUntil(User|AgencyUser $staff, \Carbon\CarbonInterface $until, ?string $grantedBy = null): void
    {
        $date = Date::today()->toDateString();
        $shiftEnd = $this->shiftEndsAt($staff);
        abort_unless($shiftEnd, 422, 'Set working hours for this staff member first (Staff Settings).');
        abort_unless($until->greaterThan($shiftEnd), 422, "The new end time must be after the shift's end ({$shiftEnd->format('h:i A')}).");

        AttendanceExtension::updateOrCreate(
            $this->staffableAttributes($staff) + ['date' => $date],
            $this->ownerAttributes($staff) + ['minutes' => (int) ceil($shiftEnd->diffInMinutes($until)), 'granted_by' => $grantedBy]
        );

        $attendance = $this->todayFor($staff);
        if ($attendance?->checked_out_at && $until->greaterThan(Date::now())) {
            $attendance->update(['checked_out_at' => null, 'auto_checked_out_at' => null]);
        }
        $this->logHistory($staff, $date, 'time_extended', notes: "Extension changed: until {$until->format('h:i A')}");
        // Already past the new end: checked out at it
        $this->enforceTimeLimit($staff);
    }

    /**
     * An admin cancels today's extension: the day ends at the shift's End
     * time again. If that has passed, a checked-in staff member is checked
     * out (at that time) and can't sign in.
     */
    public function cancelExtension(User|AgencyUser $staff): void
    {
        $date = Date::today()->toDateString();
        AttendanceExtension::where($this->staffableAttributes($staff))->whereDate('date', $date)->delete();
        $this->logHistory($staff, $date, 'time_extended', notes: 'Extension cancelled');
        $this->enforceTimeLimit($staff);
    }

    /** The permission that lets a staff member sign back in after checking out for the day. */
    public const LOGIN_AFTER_CHECKOUT = 'attendance.login-after-checkout';

    /**
     * Why the staff member may not be signed in right now — null when they
     * may. Without "Login after checkout" (for agency staff, the agency must
     * have it from the superadmin too), they can't once they've checked out
     * for today, nor once their working hours have ended, until an admin
     * extends their time.
     */
    public function loginBlockedMessage(User|AgencyUser $staff): ?string
    {
        if ($this->canLoginAfterCheckout($staff)) {
            return null;
        }

        $today = $this->todayFor($staff);
        if ($today?->checked_out_at) {
            $at = $today->checked_out_at->format('h:i A');

            return $today->auto_checked_out_at
                ? "Your working hours ended and you were checked out automatically at {$at}. If you want more time, please contact your administrator."
                : "You checked out for today at {$at}, so you can't sign in again today. Please contact your administrator.";
        }

        $endsAt = $this->endsAt($staff);
        if ($endsAt && Date::now()->greaterThanOrEqualTo($endsAt)) {
            return "Your working hours ended at {$endsAt->format('h:i A')}, so you can't sign in now. If you want more time, please contact your administrator.";
        }

        return null;
    }

    public function canLoginAfterCheckout(User|AgencyUser $staff): bool
    {
        $has = $staff->getAllPermissions()->contains('name', self::LOGIN_AFTER_CHECKOUT);

        if ($has && $staff instanceof AgencyUser) {
            $has = (bool) $staff->agency?->permissions->contains('name', self::LOGIN_AFTER_CHECKOUT);
        }

        return $has;
    }

    /** The staff member's latest attendance that hasn't been checked out (today's, or one left open). */
    private function openAttendance(User|AgencyUser $staff): ?Attendance
    {
        return Attendance::where($this->staffableAttributes($staff))
            ->whereNull('checked_out_at')
            ->latest('date')
            ->first();
    }

    public function startLunch(User|AgencyUser $staff): void
    {
        $this->logHistory($staff, Date::today()->toDateString(), 'lunch_start');
    }

    public function endLunch(User|AgencyUser $staff): void
    {
        $this->logHistory($staff, Date::today()->toDateString(), 'lunch_end');
    }

    /**
     * Staff applies for leave over a date range (inclusive); sits pending
     * until an admin/owner approves or rejects it. One history row per day
     * in the range, all sharing a batch_id so the request can be listed and
     * responded to as a single unit.
     */
    public function applyLeave(
        User|AgencyUser $staff,
        string $startDate,
        string $endDate,
        string $reason,
        ?int $leaveTypeId = null
    ): string {
        if ($this->hasPendingLeave($staff)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'start_date' => 'You already have a pending leave request. Wait for it to be approved or rejected before applying again.',
            ]);
        }

        if ($this->hasOverlappingLeave($staff, $startDate, $endDate)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'start_date' => 'You have already applied for leave during this period. Please check the dates.',
            ]);
        }

        if ($leaveTypeId) {
            $type = LeaveType::find($leaveTypeId);
            $requestedDays = \Carbon\CarbonPeriod::create($startDate, $endDate)->count();

            if ($type) {
                $balance = $type->days - $this->usedLeaveDays($staff, $leaveTypeId);

                if ($requestedDays > $balance) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'leave_type_id' => "Only {$balance} day(s) remaining for {$type->name} this year. Reduce the date range or choose another type.",
                    ]);
                }
            }
        }

        $batchId = (string) \Illuminate\Support\Str::uuid();

        $period = \Carbon\CarbonPeriod::create($startDate, $endDate);

        foreach ($period as $date) {
            $this->logHistory($staff, $date->toDateString(), 'leave_applied', 'leave', null, $reason, null, $batchId, $leaveTypeId);
        }

        return $batchId;
    }

    /**
     * Approved days used against one leave type this calendar year —
     * rejected requests never consume the quota.
     */
    private function usedLeaveDays(User|AgencyUser $staff, int $leaveTypeId): int
    {
        $yearStart = Date::now()->startOfYear()->toDateString();
        $yearEnd = Date::now()->endOfYear()->toDateString();

        return AttendanceHistory::where($this->staffableAttributes($staff))
            ->where('event', 'leave_approved')
            ->where('leave_type_id', $leaveTypeId)
            ->whereBetween('date', [$yearStart, $yearEnd])
            ->count();
    }

    /**
     * True if this staff member has any leave batch still awaiting a
     * decision — a staff member may only have one leave request in flight
     * at a time, regardless of dates.
     */
    private function hasPendingLeave(User|AgencyUser $staff): bool
    {
        $batchIds = AttendanceHistory::where($this->staffableAttributes($staff))
            ->where('event', 'leave_applied')
            ->whereNotNull('batch_id')
            ->pluck('batch_id')
            ->unique();

        if ($batchIds->isEmpty()) {
            return false;
        }

        $respondedBatchIds = AttendanceHistory::whereIn('batch_id', $batchIds)
            ->whereIn('event', ['leave_approved', 'leave_rejected'])
            ->pluck('batch_id')
            ->unique();

        return $batchIds->diff($respondedBatchIds)->isNotEmpty();
    }

    /**
     * True if any day in [startDate, endDate] already belongs to a pending
     * or approved leave batch for this staff member — rejected batches
     * don't block re-applying for the same dates.
     */
    private function hasOverlappingLeave(User|AgencyUser $staff, string $startDate, string $endDate, ?string $excludeBatchId = null): bool
    {
        $rejectedBatchIds = AttendanceHistory::where($this->staffableAttributes($staff))
            ->where('event', 'leave_rejected')
            ->pluck('batch_id');

        return AttendanceHistory::where($this->staffableAttributes($staff))
            ->where('event', 'leave_applied')
            ->whereBetween('date', [$startDate, $endDate])
            ->whereNotIn('batch_id', $rejectedBatchIds)
            ->when($excludeBatchId, fn ($query) => $query->where('batch_id', '!=', $excludeBatchId))
            ->exists();
    }

    /**
     * Edit a leave request's dates/type/reason. Staff may only edit their
     * own request while it's still pending; an admin/owner may edit any
     * request in scope even after it's been approved or rejected, in which
     * case the same decision is re-applied to the corrected date range.
     */
    public function updateLeaveBatch(
        User|AgencyUser $staff,
        string $batchId,
        string $startDate,
        string $endDate,
        string $reason,
        ?int $leaveTypeId,
        bool $isAdmin,
        ?string $status = null
    ): void {
        $existing = AttendanceHistory::where($this->staffableAttributes($staff))
            ->where('batch_id', $batchId)
            ->get();

        if ($existing->isEmpty()) {
            throw new \Exception('Leave request not found.');
        }

        $decisionEvent = $existing->first(fn ($e) => in_array($e->event, ['leave_approved', 'leave_rejected'], true));

        if ($decisionEvent && !$isAdmin) {
            throw new \Exception('This leave request has already been reviewed and can no longer be edited.');
        }

        if ($this->hasOverlappingLeave($staff, $startDate, $endDate, $batchId)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'start_date' => 'You have already applied for leave during this period. Please check the dates.',
            ]);
        }

        // Admin may explicitly set the status from the edit form (approve
        // deducts from the balance, reject/pending free it back up); a
        // staff self-edit has no status field, so the prior decision (if
        // any) simply carries over onto the corrected date range.
        $finalStatus = $isAdmin && $status
            ? $status
            : ($decisionEvent?->event === 'leave_approved' ? 'approved' : ($decisionEvent?->event === 'leave_rejected' ? 'rejected' : 'pending'));

        \Illuminate\Support\Facades\DB::transaction(function () use ($staff, $batchId, $startDate, $endDate, $reason, $leaveTypeId, $finalStatus) {
            AttendanceHistory::where('batch_id', $batchId)
                ->whereIn('event', ['leave_applied', 'leave_approved', 'leave_rejected'])
                ->delete();

            if ($leaveTypeId) {
                $type = LeaveType::find($leaveTypeId);
                $requestedDays = \Carbon\CarbonPeriod::create($startDate, $endDate)->count();

                if ($type) {
                    $balance = $type->days - $this->usedLeaveDays($staff, $leaveTypeId);

                    if ($requestedDays > $balance) {
                        throw \Illuminate\Validation\ValidationException::withMessages([
                            'leave_type_id' => "Only {$balance} day(s) remaining for {$type->name} this year. Reduce the date range or choose another type.",
                        ]);
                    }
                }
            }

            $period = \Carbon\CarbonPeriod::create($startDate, $endDate);

            foreach ($period as $date) {
                $this->logHistory($staff, $date->toDateString(), 'leave_applied', 'leave', null, $reason, null, $batchId, $leaveTypeId);
            }

            if ($finalStatus === 'approved') {
                $this->respondToLeaveBatch($staff, $batchId, true);
            } elseif ($finalStatus === 'rejected') {
                $this->respondToLeaveBatch($staff, $batchId, false);
            }
        });
    }

    /**
     * Admin/owner approves or rejects every day in a leave request at once.
     * Safe to call repeatedly in either direction (approve a rejected
     * request, reject an approved one, etc.) — any prior decision is
     * cleared first so the balance (derived from 'leave_approved' events)
     * never double-counts the same days across a switch.
     */
    public function respondToLeaveBatch(User|AgencyUser $staff, string $batchId, bool $approve): void
    {
        $applications = AttendanceHistory::where($this->staffableAttributes($staff))
            ->where('batch_id', $batchId)
            ->where('event', 'leave_applied')
            ->get();

        if ($applications->isEmpty()) {
            throw new \Exception('Leave request not found.');
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($staff, $batchId, $applications, $approve) {
            AttendanceHistory::where($this->staffableAttributes($staff))
                ->where('batch_id', $batchId)
                ->whereIn('event', ['leave_approved', 'leave_rejected'])
                ->delete();

            foreach ($applications as $application) {
                $this->logHistory(
                    $staff,
                    $application->date->toDateString(),
                    $approve ? 'leave_approved' : 'leave_rejected',
                    $approve ? 'leave' : null,
                    null,
                    null,
                    null,
                    $batchId,
                    $application->leave_type_id
                );
            }
        });
    }

    /**
     * Allowed/used/balance per leave type for a staff member, for the
     * current calendar year — "used" only counts approved days, since a
     * rejected request never consumes the quota.
     */
    public function leaveBalancesFor(User|AgencyUser $staff): Collection
    {
        $owner = $this->ownerAttributes($staff);

        $types = LeaveType::where('owner_type', $owner['owner_type'])
            ->where('owner_id', $owner['owner_id'])
            ->orderBy('name')
            ->get();

        $yearStart = Date::now()->startOfYear()->toDateString();
        $yearEnd = Date::now()->endOfYear()->toDateString();

        $usedByType = AttendanceHistory::where($this->staffableAttributes($staff))
            ->where('event', 'leave_approved')
            ->whereNotNull('leave_type_id')
            ->whereBetween('date', [$yearStart, $yearEnd])
            ->selectRaw('leave_type_id, count(*) as days')
            ->groupBy('leave_type_id')
            ->pluck('days', 'leave_type_id');

        return $types->map(function ($type) use ($usedByType) {
            $used = (int) ($usedByType[$type->id] ?? 0);

            return [
                'id' => $type->id,
                'name' => $type->name,
                'allowed' => $type->days,
                'used' => $used,
                'balance' => max($type->days - $used, 0),
            ];
        })->values();
    }

    /**
     * Pending leave requests for the current session's staff (an agency
     * sees only its own, a superadmin sees its own), one row per batch.
     */
    public function pendingLeaveRequests(): Collection
    {
        $agency = Auth::guard('agency')->user()?->agency;

        $query = AttendanceHistory::with('leaveType')->where('event', 'leave_applied')->whereNotNull('batch_id');

        if ($agency) {
            $query->where('staffable_type', AgencyUser::class)
                ->where('owner_type', Agency::class)
                ->where('owner_id', $agency->id);
        } else {
            $query->where('staffable_type', User::class)
                ->whereNull('owner_type');
        }

        $applications = $query->orderBy('date')->get()->groupBy('batch_id');

        // Drop any batch that already has a later approve/reject event.
        $respondedBatchIds = AttendanceHistory::whereIn('batch_id', $applications->keys())
            ->whereIn('event', ['leave_approved', 'leave_rejected'])
            ->pluck('batch_id')
            ->unique();

        return $applications
            ->reject(fn ($rows, $batchId) => $respondedBatchIds->contains($batchId))
            ->map(function ($rows, $batchId) {
                $first = $rows->first();

                return [
                    'batch_id' => $batchId,
                    'staff_uid' => $first->staffable->uid,
                    'staff_name' => $first->staffable->name,
                    'leave_type' => $first->leaveType?->name,
                    'start_date' => $rows->min('date')->toDateString(),
                    'end_date' => $rows->max('date')->toDateString(),
                    'reason' => $first->notes,
                    'applied_at' => $first->occurred_at->format('M d, Y h:i A'),
                ];
            })
            ->values();
    }

    /**
     * Every leave request (any status, any staff member) the current
     * session owns — agency-own or superadmin-own — one row per batch,
     * newest first. The default view of the Leave page before a specific
     * staff member is selected.
     */
    public function allLeaveHistory(): Collection
    {
        $agency = Auth::guard('agency')->user()?->agency;

        $query = AttendanceHistory::with(['leaveType', 'staffable'])
            ->whereIn('event', ['leave_applied', 'leave_approved', 'leave_rejected'])
            ->whereNotNull('batch_id');

        if ($agency) {
            $query->where('staffable_type', AgencyUser::class)
                ->where('owner_type', Agency::class)
                ->where('owner_id', $agency->id);
        } else {
            $query->where('staffable_type', User::class)
                ->whereNull('owner_type');
        }

        $events = $query->orderBy('date')->get()->groupBy('batch_id');

        $statusMap = [
            'leave_applied' => 'pending',
            'leave_approved' => 'approved',
            'leave_rejected' => 'rejected',
        ];

        return $events
            ->map(function ($rows, $batchId) use ($statusMap) {
                $applied = $rows->firstWhere('event', 'leave_applied');
                $latest = $rows->sortBy('occurred_at')->last();

                return [
                    'batch_id' => $batchId,
                    'staff_uid' => $applied?->staffable->uid,
                    'staff_name' => $applied?->staffable->name,
                    'leave_type' => $applied?->leaveType?->name,
                    'leave_type_id' => $applied?->leave_type_id,
                    'start_date' => $rows->min('date')->toDateString(),
                    'end_date' => $rows->max('date')->toDateString(),
                    'reason' => $applied?->notes,
                    'status' => $statusMap[$latest->event] ?? 'pending',
                    'applied_at' => $applied?->occurred_at->format('M d, Y h:i A'),
                ];
            })
            ->sortByDesc('start_date')
            ->values();
    }

    /**
     * Every leave request (any status) a specific staff member has made,
     * one row per batch — newest first.
     */
    public function leaveHistoryFor(User|AgencyUser $staff): Collection
    {
        $events = AttendanceHistory::with('leaveType')
            ->where($this->staffableAttributes($staff))
            ->whereIn('event', ['leave_applied', 'leave_approved', 'leave_rejected'])
            ->whereNotNull('batch_id')
            ->orderBy('date')
            ->get()
            ->groupBy('batch_id');

        $statusMap = [
            'leave_applied' => 'pending',
            'leave_approved' => 'approved',
            'leave_rejected' => 'rejected',
        ];

        return $events
            ->map(function ($rows, $batchId) use ($statusMap) {
                $applied = $rows->firstWhere('event', 'leave_applied');
                $latest = $rows->sortBy('occurred_at')->last();

                return [
                    'batch_id' => $batchId,
                    'leave_type' => $applied?->leaveType?->name,
                    'leave_type_id' => $applied?->leave_type_id,
                    'start_date' => $rows->min('date')->toDateString(),
                    'end_date' => $rows->max('date')->toDateString(),
                    'reason' => $applied?->notes,
                    'status' => $statusMap[$latest->event] ?? 'pending',
                    'applied_at' => $applied?->occurred_at->format('M d, Y h:i A'),
                ];
            })
            ->sortByDesc('start_date')
            ->values();
    }

    /**
     * Admin correction: set/clear a staff member's check-in and check-out
     * times, and/or the day's status (present/half day/absent) and work
     * type, for a given day. Creates the day's row if it didn't exist yet
     * (e.g. correcting a missed check-in). Every change is logged.
     */
    public function updateDay(
        User|AgencyUser $staff,
        string $date,
        ?string $checkedInTime,
        ?string $checkedOutTime,
        bool $clearCheckout = false,
        ?string $status = null,
        ?string $workType = null
    ): Attendance {
        $attendance = Attendance::firstOrNew(
            $this->staffableAttributes($staff) + ['date' => $date]
        );

        if (!$attendance->exists) {
            $attendance->fill($this->ownerAttributes($staff));
        }

        if ($checkedInTime) {
            $attendance->checked_in_at = Date::parse("{$date} {$checkedInTime}");
        }

        if ($clearCheckout) {
            $attendance->checked_out_at = null;
        } elseif ($checkedOutTime) {
            $attendance->checked_out_at = Date::parse("{$date} {$checkedOutTime}");
        }

        $attendance->save();

        if ($status || $workType) {
            $this->logHistory($staff, $date, 'status_updated', $status, $workType, 'Updated by admin');
        }

        return $attendance;
    }

    /**
     * Attendance rows merged with history events for the given staff member
     * within a calendar month, shaped for the frontend calendar.
     */
    public function monthlyHistory(User|AgencyUser $staff, string $month): Collection
    {
        $start = Date::parse($month.'-01')->startOfMonth();
        $end = $start->copy()->endOfMonth();

        $attendanceByDate = Attendance::where($this->staffableAttributes($staff))
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->get()
            ->keyBy(fn ($a) => $a->date->toDateString());

        $eventsByDate = AttendanceHistory::where($this->staffableAttributes($staff))
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->orderBy('occurred_at')
            ->get()
            ->groupBy(fn ($h) => $h->date->toDateString());

        $dates = $attendanceByDate->keys()->merge($eventsByDate->keys())->unique();

        // Every day from the staff member's joining date up to today with no
        // record at all is a missed check-in — backfill it so it renders as
        // Absent instead of a blank cell.
        $joiningDate = $staff->staffProfile?->joining_date;
        $today = Date::today();

        if ($joiningDate) {
            $rangeStart = $joiningDate->greaterThan($start) ? $joiningDate : $start;
            $rangeEnd = $today->lessThan($end) ? $today : $end;

            if ($rangeStart->lessThanOrEqualTo($rangeEnd)) {
                foreach (\Carbon\CarbonPeriod::create($rangeStart, $rangeEnd) as $date) {
                    $dates->push($date->toDateString());
                }
            }
        }

        $dates = $dates->unique()->sort()->values();

        return $dates->map(fn ($dateStr) => $this->buildDayDetail(
            $dateStr,
            $attendanceByDate->get($dateStr),
            $eventsByDate->get($dateStr, collect()),
            $staff
        ));
    }

    /**
     * The whole team's month, day by day (up to today): who was present
     * (with their times), on half day, on leave or absent — for the
     * all-staff calendar. A member counts from their joining date (or when
     * their account was made); a day with no record after that is Absent.
     *
     * @param  Collection<int, User|AgencyUser>  $staffList
     */
    public function teamMonth(Collection $staffList, string $month): array
    {
        $start = Date::parse($month.'-01')->startOfMonth();
        $end = $start->copy()->endOfMonth();
        $today = Date::today();
        if ($staffList->isEmpty() || $start->greaterThan($today)) {
            return [];
        }
        $lastDay = $today->lessThan($end) ? $today : $end;

        // One query each for the month's attendance and history, for everyone
        $type = get_class($staffList->first());
        $ids = $staffList->pluck('id');
        $inRange = fn ($q) => $q->where('staffable_type', $type)
            ->whereIn('staffable_id', $ids)
            ->whereBetween('date', [$start->toDateString(), $lastDay->toDateString()]);

        $attendance = $inRange(Attendance::query())->get()
            ->keyBy(fn ($a) => $a->staffable_id.'|'.$a->date->toDateString());
        $events = $inRange(AttendanceHistory::query())->orderBy('occurred_at')->get()
            ->groupBy(fn ($h) => $h->staffable_id.'|'.$h->date->toDateString());

        $days = [];
        foreach (\Carbon\CarbonPeriod::create($start, $lastDay) as $date) {
            $dateStr = $date->toDateString();
            $day = ['date' => $dateStr, 'total' => 0, 'present' => [], 'half_day' => [], 'leave' => [], 'absent' => []];

            foreach ($staffList as $staff) {
                $joined = ($staff->staffProfile?->joining_date ?? $staff->created_at)?->copy()->startOfDay();
                if ($joined && $joined->greaterThan($date)) {
                    continue; // not on the team yet
                }

                $key = $staff->id.'|'.$dateStr;
                $detail = $this->buildDayDetail($dateStr, $attendance->get($key), $events->get($key, collect()), $staff);
                // A leave still waiting for a decision shows with the leaves (marked pending)
                $bucket = $detail['status'] ?? 'leave';
                if (! isset($day[$bucket])) {
                    $bucket = 'absent';
                }

                $day['total']++;
                $day[$bucket][] = [
                    'uid' => $staff->uid,
                    'name' => $staff->name,
                    'photo' => $staff->profile_pic ? $staff->profile_image_url : null,
                    'checked_in_at' => $detail['checked_in_at'],
                    'checked_out_at' => $detail['checked_out_at'],
                    'work_type' => $detail['work_type'],
                    'leave_status' => $detail['status'] === null ? 'pending' : $detail['leave_status'],
                    'worked_minutes' => $detail['worked_minutes'],
                    'lunch_over_minutes' => $detail['lunch_over_minutes'],
                    'late_minutes' => $detail['late_minutes'],
                    'day_pay' => $detail['day_pay'],
                    'currency' => $detail['currency'],
                ];
            }

            $days[] = $day;
        }

        return $days;
    }

    /**
     * Today's detail for the given staff member, in the same shape as a
     * monthlyHistory() entry — or null if nothing recorded yet today.
     */
    public function todayDetail(User|AgencyUser $staff): ?array
    {
        $dateStr = Date::today()->toDateString();
        $attendance = $this->todayFor($staff);
        $events = AttendanceHistory::where($this->staffableAttributes($staff))
            ->where('date', $dateStr)
            ->orderBy('occurred_at')
            ->get();

        if (!$attendance && $events->isEmpty()) {
            return null;
        }

        return $this->buildDayDetail($dateStr, $attendance, $events, $staff);
    }

    private function buildDayDetail(string $dateStr, ?Attendance $attendance, Collection $events, User|AgencyUser|null $staff = null): array
    {
        // Only an approved leave marks the day "Leave" on the calendar.
        // status_updated carries admin corrections and always wins if it's
        // the most recent event. A day actually checked into is "present"
        // regardless. Otherwise, a day covered by a still-pending or
        // rejected leave application shows no status at all (not "Absent")
        // since nothing has actually been decided about it — only a day
        // with no leave application and no check-in counts as Absent.
        $statusEvents = $events->whereIn('event', ['leave_approved', 'status_updated']);
        $latestStatusEvent = $statusEvents->last();
        $isUndecidedLeaveDay = $events->contains(fn ($e) => in_array($e->event, ['leave_applied', 'leave_rejected'], true));

        if ($latestStatusEvent) {
            $status = $latestStatusEvent->status;
        } elseif ($attendance) {
            $status = 'present';
        } elseif ($isUndecidedLeaveDay) {
            $status = null;
        } else {
            $status = 'absent';
        }
        $workType = $events->reverse()->first(fn ($e) => $e->work_type)?->work_type;
        $lunchStart = $events->where('event', 'lunch_start')->last()?->occurred_at;
        $lunchEnd = $events->where('event', 'lunch_end')->last()?->occurred_at;

        // The reason lives on the original application; approve/reject events
        // that come after it carry no notes of their own, so read the reason
        // from 'leave_applied' specifically while the status comes from
        // whichever leave event happened most recently.
        $leaveEvents = $events->whereIn('event', ['leave_applied', 'leave_approved', 'leave_rejected']);
        $leaveReason = $leaveEvents->firstWhere('event', 'leave_applied')?->notes;
        $latestLeaveEvent = $leaveEvents->last();

        $leaveStatusMap = [
            'leave_applied' => 'pending',
            'leave_approved' => 'approved',
            'leave_rejected' => 'rejected',
        ];

        return [
            'date' => $dateStr,
            'status' => $status,
            'work_type' => $workType,
            'checked_in_at' => $attendance?->checked_in_at?->format('h:i A'),
            'checked_out_at' => $attendance?->checked_out_at?->format('h:i A'),
            'checked_in_time' => $attendance?->checked_in_at?->format('H:i'),
            'checked_out_time' => $attendance?->checked_out_at?->format('H:i'),
            'lunch_start_at' => $lunchStart?->format('h:i A'),
            'lunch_end_at' => $lunchEnd?->format('h:i A'),
            'leave_reason' => $leaveReason,
            'leave_status' => $latestLeaveEvent ? ($leaveStatusMap[$latestLeaveEvent->event] ?? null) : null,
            'leave_batch_id' => $latestLeaveEvent?->batch_id,
            'extended_minutes' => $staff ? $this->extensionMinutes($staff, $dateStr) : 0,
            'auto_checked_out' => $attendance?->auto_checked_out_at !== null,
            'time_limit_at' => $staff && $attendance ? $this->deadlineFor($staff, $attendance)?->format('h:i A') : null,
        ] + $this->dayWork($dateStr, $status, $attendance, $lunchStart, $lunchEnd, $staff);
    }

    /**
     * Hours and pay for a day, from the staff member's own working hours
     * (StaffTiming) and salary (StaffPayment):
     * - worked: check-in to check-out, less the lunch actually taken
     * - lunch over: lunch taken beyond the lunch allowed
     * - late / early: against the shift start and end
     * - day's pay: hours worked × the hourly rate (per hour as is; per day ÷
     *   the paid hours a day; per month ÷ working days × paid hours a day)
     */
    private function dayWork(string $dateStr, ?string $status, ?Attendance $attendance, $lunchStart, $lunchEnd, User|AgencyUser|null $staff): array
    {
        $timing = $this->timingFor($staff);
        $payment = $staff?->staffPayment;
        $in = $attendance?->checked_in_at;
        $out = $attendance?->checked_out_at;

        $lunchTaken = $lunchStart && $lunchEnd ? max((int) round($lunchStart->diffInMinutes($lunchEnd)), 0) : null;
        $lunchOver = $lunchTaken !== null && $timing?->lunch_minutes !== null
            ? max($lunchTaken - (int) $timing->lunch_minutes, 0) : 0;
        $worked = $in && $out ? max((int) round($in->diffInMinutes($out)) - (int) $lunchTaken, 0) : null;

        $shiftAt = fn (?string $time) => $time ? Date::parse("{$dateStr} {$time}") : null;
        $start = $shiftAt($timing?->shift_start);
        $end = $shiftAt($timing?->shift_end);
        $late = $in && $start && $in->greaterThan($start) ? (int) round($start->diffInMinutes($in)) : 0;
        $early = $out && $end && $out->lessThan($end) ? (int) round($out->diffInMinutes($end)) : 0;

        $rate = $this->hourlyRate($timing, $payment);
        $paid = in_array($status, ['present', 'half_day'], true);

        return [
            'worked_minutes' => $worked,
            'lunch_taken_minutes' => $lunchTaken,
            'lunch_allowed_minutes' => $timing?->lunch_minutes,
            'lunch_over_minutes' => $lunchOver,
            'late_minutes' => $late,
            'early_minutes' => $early,
            'shift' => $timing?->shift_start && $timing?->shift_end
                ? substr($timing->shift_start, 0, 5) . ' – ' . substr($timing->shift_end, 0, 5) : null,
            'hourly_rate' => $rate,
            'day_pay' => $rate !== null && $worked !== null && $paid ? round($worked / 60 * $rate, 2) : null,
            'currency' => $payment?->currency,
        ];
    }

    /** The hours the staff member works to: their own, or the owner's default for any field they haven't set. */
    private function timingFor(User|AgencyUser|null $staff): ?\App\Models\StaffTiming
    {
        if (! $staff) {
            return null;
        }
        $key = get_class($staff) . ':' . $staff->id;

        return $this->timings[$key] ??= \App\Models\StaffTiming::effective(
            $staff->staffTiming,
            \App\Models\StaffTiming::defaultForStaff($staff)
        );
    }

    /** The staff member's hourly rate now (salary and working hours, their own or the default). */
    public function rateFor(User|AgencyUser $staff): ?float
    {
        return $this->hourlyRate($this->timingFor($staff), $staff->staffPayment);
    }

    /** The staff member's hourly rate, from their salary and working hours; null when it can't be worked out. */
    private function hourlyRate(?\App\Models\StaffTiming $timing, ?\App\Models\StaffPayment $payment): ?float
    {
        $salary = (float) ($payment?->salary ?? 0);
        if ($salary <= 0) {
            return null;
        }
        if ($payment->salary_type === 'per_hour') {
            return $salary;
        }
        $hours = ($timing?->workMinutes() ?? 0) / 60;
        if ($hours <= 0) {
            return null;
        }

        return $payment->salary_type === 'per_day'
            ? round($salary / $hours, 4)
            : round($salary / (max((int) ($timing->working_days ?: 26), 1) * $hours), 4);
    }

    /**
     * How many of the current session's staff have marked attendance today —
     * an agency sees only its own staff, a superadmin sees its own.
     */
    public function presentTodayCount(): int
    {
        $agency = Auth::guard('agency')->user()?->agency;

        $query = Attendance::whereDate('date', Date::today());

        if ($agency) {
            $query->where('staffable_type', AgencyUser::class)
                ->where('owner_type', Agency::class)
                ->where('owner_id', $agency->id);
        } else {
            $query->where('staffable_type', User::class)
                ->whereNull('owner_type');
        }

        return $query->count();
    }
}
