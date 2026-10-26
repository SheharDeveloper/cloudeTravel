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
 * still in progress counts up to now.
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
            'worked_minutes' => (int) $days->sum(fn ($d) => $d['worked_minutes'] ?? 0),
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
                'date', 'status', 'checked_in_at', 'checked_out_at', 'auto_checked_out', 'in_progress',
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

    /** Who the slip is from: the agency, or the platform for superadmin staff. */
    public function companyFor(SalarySlip $slip): array
    {
        $agency = $slip->owner_type === Agency::class ? Agency::find($slip->owner_id) : null;

        return [
            'name' => $agency?->agency_name ?? config('app.name'),
            'email' => $agency?->email,
            'phone' => $agency?->phone_number,
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

        return $calendar->sortKeys()->map(function ($day, $date) use ($attendance, $lunch, $from, $to, $rate) {
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
                // Pay by the minute
                'day_pay' => $rate !== null && $worked !== null && $paid ? round($worked / 60 * $rate, 2) : null,
                'in_progress' => $in && ! $a->checked_out_at && $isToday,
            ] + $day;
        })->values();
    }
}
