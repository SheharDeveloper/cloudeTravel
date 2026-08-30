<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\AgencyUser;
use App\Models\Attendance;
use App\Models\AttendanceHistory;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;

class AttendanceService
{
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
            $eventsByDate->get($dateStr, collect())
        ));
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

        return $this->buildDayDetail($dateStr, $attendance, $events);
    }

    private function buildDayDetail(string $dateStr, ?Attendance $attendance, Collection $events): array
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
        ];
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
