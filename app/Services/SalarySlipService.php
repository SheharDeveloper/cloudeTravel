<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\AgencyUser;
use App\Models\Attendance;
use App\Models\AttendanceHistory;
use App\Models\SalarySlip;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Date;

/**
 * Salary slips: a staff member is paid for a period — from the end of their
 * last slip (or their joining date) up to now — by the minute they actually
 * worked × their hourly rate, less their taxes and deductions as set on their
 * staff profile (each a percentage of the gross or a fixed amount). A day
 * still in progress counts up to now. A day of approved paid leave pays a
 * full working day (shift less lunch); unpaid leave pays nothing.
 */
class SalarySlipService
{
    public function __construct(protected AttendanceService $attendanceService)
    {
    }

    /** Where the next slip starts: when the last one ended, else the joining date, else the first attendance. */
    public function periodStartFor(User|AgencyUser $staff): CarbonInterface
    {
        $last = $this->latestSlip($staff);
        if ($last?->period_end) {
            return Date::parse($last->period_end);
        }
        if ($joined = $staff->staffProfile?->joining_date) {
            return Date::parse($joined)->startOfDay();
        }
        $first = Attendance::where(['staffable_type' => get_class($staff), 'staffable_id' => $staff->id])->min('date');

        return $first ? Date::parse($first)->startOfDay() : Date::today();
    }

    public function latestSlip(User|AgencyUser $staff): ?SalarySlip
    {
        return SalarySlip::where('staffable_type', get_class($staff))
            ->where('staffable_id', $staff->id)
            ->orderByDesc('period_end')
            ->first();
    }

    /** The period's figures (from its start up to $to, by default now), worked out from attendance. */
    public function calculate(User|AgencyUser $staff, ?CarbonInterface $from = null, ?CarbonInterface $to = null): array
    {
        $staff->loadMissing('staffPayment', 'staffTaxDeductions', 'staffTiming', 'staffProfile');
        $from ??= $this->periodStartFor($staff);
        $to ??= Date::now();
        $days = $this->days($staff, $from, $to);
        $payment = $staff->staffPayment;

        $gross = round((float) $days->sum(fn ($d) => $d['day_pay'] ?? 0), 2);
        $paidLeave = $days->where('status', 'leave')->where('leave_paid', true);
        $deductions = $staff->staffTaxDeductions
            ->map(function ($d) use ($gross) {
                $percent = ($d->calc ?? ($d->type === 'deduction' ? 'fixed' : 'percent')) === 'percent';
                return [
                    'name' => $d->name,
                    'type' => $d->type,
                    'calc' => $percent ? 'percent' : 'fixed',
                    'value' => (float) $d->value,
                    'amount' => round($percent ? $gross * (float) $d->value / 100 : (float) $d->value, 2),
                ];
            })
            ->values()
            ->all();
        $totalDeductions = round(array_sum(array_column($deductions, 'amount')), 2);

        return [
            'staff_name' => $staff->name,
            'period_start' => $from->toDateTimeString(),
            'period_end' => $to->toDateTimeString(),
            'period_label' => $this->periodLabel($from, $to),
            'salary' => $payment?->salary !== null ? (float) $payment->salary : null,
            'salary_type' => $payment?->salary_type,
            'currency' => $payment?->currency,
            'shift' => $days->firstWhere('shift')['shift'] ?? null,
            'days_present' => $days->whereIn('status', ['present', 'half_day'])->count(),
            'days_leave' => $days->where('status', 'leave')->count(),
            'days_absent' => $days->where('status', 'absent')->count(),
            // Leave: paid days are paid as a full working day; unpaid ones aren't
            'paid_leave_days' => $paidLeave->count(),
            'unpaid_leave_days' => $days->where('status', 'leave')->where('leave_paid', false)->count(),
            'paid_leave_pay' => round((float) $paidLeave->sum(fn ($d) => $d['day_pay'] ?? 0), 2),
            'worked_minutes' => (int) $days->where('status', '!=', 'leave')->sum(fn ($d) => $d['worked_minutes'] ?? 0),
            'hourly_rate' => $this->attendanceService->rateFor($staff),
            'gross' => $gross,
            'deductions' => $deductions,
            'total_deductions' => $totalDeductions,
            'net' => max(round($gross - $totalDeductions, 2), 0),
        ];
    }

    /** The period so far, day by day, with the totals and deductions a slip would show. */
    public function breakdown(User|AgencyUser $staff): array
    {
        $from = $this->periodStartFor($staff);
        $to = Date::now();

        return [
            'uid' => $staff->uid,
            'name' => $staff->name,
            'summary' => $this->calculate($staff, $from, $to),
            'days' => $this->days($staff, $from, $to)->map(fn ($d) => collect($d)->only([
                'date', 'status', 'leave_type', 'leave_paid', 'checked_in_at', 'checked_out_at', 'auto_checked_out', 'in_progress',
                'lunch_taken_minutes', 'lunch_over_minutes', 'late_minutes', 'worked_minutes', 'day_pay',
            ]))->values(),
        ];
    }

    /** Saves a slip for the period up to now; the next one starts from here. */
    public function generate(User|AgencyUser $staff, ?string $generatedBy): SalarySlip
    {
        $from = $this->periodStartFor($staff);
        $to = Date::now();

        return SalarySlip::create(
            collect($this->calculate($staff, $from, $to))->except('period_label')->all() + [
                'staffable_type' => get_class($staff),
                'staffable_id' => $staff->id,
                'owner_type' => $staff instanceof AgencyUser ? Agency::class : User::class,
                'owner_id' => $staff instanceof AgencyUser ? $staff->agency_id : null,
                'month' => $to->format('Y-m'),
                'generated_by' => $generatedBy,
                'generated_at' => $to,
            ]
        );
    }

    /**
     * Works the slip out again for the same period with the staff member's
     * current settings (salary and its type, rate, working hours, taxes and
     * deductions) — after correcting one of them. Only their latest slip,
     * so later slips' periods stay as they were.
     */
    public function recalculate(SalarySlip $slip, ?string $by): SalarySlip
    {
        $staff = $slip->staffable;
        abort_unless($staff && $slip->period_start && $slip->period_end, 422, 'This slip can\'t be recalculated.');
        abort_unless($this->latestSlip($staff)?->is($slip), 422, 'Only the latest slip can be recalculated.');

        $staff->unsetRelation('staffPayment')->unsetRelation('staffTaxDeductions')->unsetRelation('staffTiming');
        $slip->update(
            collect($this->calculate($staff, $slip->period_start, $slip->period_end))->except(['period_label', 'period_start', 'period_end'])->all()
            + ['generated_by' => $by, 'generated_at' => Date::now()]
        );

        return $slip->fresh();
    }

    /** A staff member's own slips, newest first. */
    public function slipsFor(User|AgencyUser $staff)
    {
        return SalarySlip::where('staffable_type', get_class($staff))
            ->where('staffable_id', $staff->id)
            ->orderByDesc('period_end')
            ->get();
    }

    public function periodLabel(CarbonInterface $from, CarbonInterface $to): string
    {
        return $from->format('d M Y, h:i A') . ' – ' . $to->format('d M Y, h:i A');
    }

    /**
     * Who the slip is from, for its header: the agency (its logo, names and
     * contact details — Contact Info first, then the agency's own), or the
     * platform for superadmin staff (the superadmin's Contact Info).
     */
    public function companyFor(SalarySlip $slip): array
    {
        $agency = $slip->owner_type === Agency::class ? Agency::find($slip->owner_id) : null;
        $contact = $agency
            ? \App\Models\ContactInfo::where('owner_type', Agency::class)->where('owner_id', $agency->id)->first()
            : \App\Models\ContactInfo::where('owner_type', User::class)->orderBy('owner_id')->first();

        $agencyAddress = $agency
            ? collect([$agency->address, $agency->city, $agency->state, $agency->postal_code, $agency->country])->filter()->implode(', ')
            : null;

        return [
            'name' => $agency?->agency_name ?? config('app.name'),
            'legal_name' => $agency && $agency->legal_name && strcasecmp($agency->legal_name, $agency->agency_name) !== 0 ? $agency->legal_name : null,
            'logo' => $agency?->logo ?: ($contact?->logo ?: '/images/logo.png'),
            'email' => $contact?->email ?: $agency?->email,
            'phone' => $contact?->phone ?: $agency?->phone_number,
            'address' => $agencyAddress ?: $contact?->address,
        ];
    }

    /** The employee block: number, contact details and address lines. */
    public function employeeFor(SalarySlip $slip): array
    {
        $staff = $slip->staffable;
        $profile = $staff?->staffProfile;

        return [
            'name' => $slip->staff_name,
            // A short staff number: "EMP-0007" (agency staff "AEMP-")
            'number' => $staff ? (($staff instanceof AgencyUser ? 'AEMP-' : 'EMP-') . str_pad((string) $staff->id, 4, '0', STR_PAD_LEFT)) : null,
            'email' => $staff?->email,
            'phone' => $staff?->phone,
            'joining_date' => $profile?->joining_date?->format('d M Y'),
            'address_lines' => collect([$profile?->address, $profile?->city, $profile?->county, $profile?->country])->filter()->values()->all(),
        ];
    }

    /**
     * Year to date: this slip and the staff member's earlier ones in the same
     * calendar year — pay, each deduction, and net.
     */
    public function yearToDate(SalarySlip $slip): array
    {
        $end = $slip->period_end ?? $slip->generated_at ?? Date::now();
        $slips = SalarySlip::where('staffable_type', $slip->staffable_type)
            ->where('staffable_id', $slip->staffable_id)
            ->whereYear('period_end', $end->year)
            ->where('period_end', '<=', $end)
            ->get();

        $deductions = [];
        foreach ($slips as $s) {
            foreach ($s->deductions ?? [] as $d) {
                $deductions[$d['name']] = round(($deductions[$d['name']] ?? 0) + (float) ($d['amount'] ?? 0), 2);
            }
        }

        return [
            'year' => $end->year,
            'slips' => $slips->count(),
            'gross' => round((float) $slips->sum('gross'), 2),
            'deductions' => $deductions,
            'total_deductions' => round((float) $slips->sum('total_deductions'), 2),
            'net' => round((float) $slips->sum('net'), 2),
            'worked_minutes' => (int) $slips->sum('worked_minutes'),
        ];
    }

    /**
     * Each day of the period: the calendar's day (status, times, late, lunch)
     * with the minutes worked inside the period — the first day from when the
     * period starts, today up to now — and that time's pay.
     */
    private function days(User|AgencyUser $staff, CarbonInterface $from, CarbonInterface $to): Collection
    {
        $key = ['staffable_type' => get_class($staff), 'staffable_id' => $staff->id];
        $fromDate = $from->toDateString();
        $toDate = $to->toDateString();
        $rate = $this->attendanceService->rateFor($staff);
        $timing = $this->attendanceService->timingForPay($staff);
        $payment = $staff->staffPayment;

        // The calendar's days, month by month across the period
        $calendar = collect();
        for ($m = $from->copy()->startOfMonth(); $m->lessThanOrEqualTo($to); $m = $m->addMonth()) {
            $calendar = $calendar->merge($this->attendanceService->monthlyHistory($staff, $m->format('Y-m')));
        }
        $calendar = $calendar->filter(fn ($d) => $d['date'] >= $fromDate && $d['date'] <= $toDate)->keyBy('date');

        $attendance = Attendance::where($key)->whereBetween('date', [$fromDate, $toDate])->get()
            ->keyBy(fn ($a) => $a->date->toDateString());
        $lunch = AttendanceHistory::where($key)->whereBetween('date', [$fromDate, $toDate])
            ->whereIn('event', ['lunch_start', 'lunch_end'])->orderBy('occurred_at')->get()
            ->groupBy(fn ($h) => $h->date->toDateString());
        // Each leave day's type (paid or not), from the leave request's events
        $leaveTypes = AttendanceHistory::with('leaveType')->where($key)->whereBetween('date', [$fromDate, $toDate])
            ->whereNotNull('leave_type_id')->orderBy('occurred_at')->get()
            ->groupBy(fn ($h) => $h->date->toDateString())
            ->map(fn ($events) => $events->last()->leaveType);
        $paidDayMinutes = $this->attendanceService->paidMinutesPerDay($staff);

        return $calendar->sortKeys()->map(function ($day, $date) use ($attendance, $lunch, $leaveTypes, $paidDayMinutes, $from, $to, $rate, $timing, $payment) {
            // An approved leave day: a full working day's pay if its leave type is paid
            if ($day['status'] === 'leave') {
                $type = $leaveTypes->get($date);
                $paid = (bool) $type?->is_paid;

                return [
                    'worked_minutes' => $paid ? $paidDayMinutes : null,
                    'day_pay' => $paid && $rate !== null && $paidDayMinutes ? round($paidDayMinutes / 60 * $rate, 2) : null,
                    'in_progress' => false,
                    'leave_type' => $type?->name,
                    'leave_paid' => $paid,
                ] + $day;
            }

            $a = $attendance->get($date);
            $isToday = $date === Date::today()->toDateString();
            $in = $a?->checked_in_at;
            $out = $a?->checked_out_at ?? ($in && $isToday ? Date::now() : null);

            $worked = null;
            if ($in && $out) {
                // Only the part of the day inside the period
                $start = $in->greaterThan($from) ? $in : $from;
                $end = $out->lessThan($to) ? $out : $to;
                $seconds = max($end->getTimestamp() - $start->getTimestamp(), 0);

                $events = $lunch->get($date, collect());
                $lunchStart = $events->where('event', 'lunch_start')->last()?->occurred_at;
                $lunchEnd = $events->where('event', 'lunch_end')->last()?->occurred_at ?? ($lunchStart && $isToday && ! $a->checked_out_at ? Date::now() : null);
                if ($lunchStart && $lunchEnd && $seconds > 0) {
                    $overlap = min($end->getTimestamp(), $lunchEnd->getTimestamp()) - max($start->getTimestamp(), $lunchStart->getTimestamp());
                    $seconds -= max($overlap, 0);
                }
                $worked = intdiv(max($seconds, 0), 60);
            }
            $paid = in_array($day['status'], ['present', 'half_day'], true);

            return [
                'worked_minutes' => $worked,
                // Pay by the minute; a day or month salary pays at most one full day a day
                'day_pay' => $rate !== null && $worked !== null && $paid
                    ? round($this->attendanceService->payableMinutes($worked, $timing, $payment) / 60 * $rate, 2)
                    : null,
                'in_progress' => $in && ! $a->checked_out_at && $isToday,
            ] + $day;
        })->values();
    }
}
