<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AgencyUser;
use App\Models\SalarySlip;
use App\Models\User;
use App\Services\AttendanceService;
use App\Services\SalarySlipService;
use App\Services\StaffService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Salary Slips: the owner/superadmin generates a staff member's slip for the
 * period since their last one, up to now (minutes worked × hourly rate, less
 * tax and deductions); a staff member sees their own slips in their login.
 */
class SalarySlipController extends Controller
{
    public function __construct(
        protected SalarySlipService $slips,
        protected StaffService $staffService,
        protected AttendanceService $attendanceService,
    ) {
    }

    public function index(Request $request)
    {
        $principal = $this->attendanceService->currentPrincipal();

        // A staff member: their own slips
        if ($this->attendanceService->isStaff($principal)) {
            return Inertia::render('Admin/SalarySlips/Index', [
                'isStaff' => true,
                'rows' => [],
                'history' => $this->slips->slipsFor($principal)->map(fn (SalarySlip $s) => $this->slipSummary($s))->values(),
            ]);
        }

        $staff = $this->ownStaff();

        return Inertia::render('Admin/SalarySlips/Index', [
            'isStaff' => false,
            'rows' => $staff->map(function (User|AgencyUser $member) {
                $last = $this->slips->latestSlip($member);

                return [
                    'uid' => $member->uid,
                    'name' => $member->name,
                    'email' => $member->email,
                    // Since the last slip, up to now
                    'preview' => $this->slips->calculate($member),
                    'last_slip' => $last ? $this->slipSummary($last) : null,
                ];
            })->values(),
            // Slips generated so far, newest first
            'history' => SalarySlip::where(function ($q) use ($staff) {
                foreach ($staff as $member) {
                    $q->orWhere(fn ($w) => $w->where('staffable_type', get_class($member))->where('staffable_id', $member->id));
                }
            })->when($staff->isEmpty(), fn ($q) => $q->whereRaw('1 = 0'))
                ->orderByDesc('period_end')->limit(100)->get()
                ->map(fn (SalarySlip $s) => $this->slipSummary($s) + ['staff_name' => $s->staff_name])->values(),
            // One staff member's period day by day, loaded when "Details" is clicked
            'detail' => Inertia::optional(function () use ($request) {
                $member = $this->ownStaff()->firstWhere('uid', $request->get('detail'));

                return $member ? $this->slips->breakdown($member) : null;
            }),
        ]);
    }

    /** Generates slips for the chosen staff: since each one's last slip, up to now. */
    public function generate(Request $request)
    {
        abort_if($this->attendanceService->isStaff($this->attendanceService->currentPrincipal()), 403);

        $validated = $request->validate([
            'uids' => 'required|array|min:1',
            'uids.*' => 'string',
        ]);
        $staff = $this->ownStaff()->whereIn('uid', $validated['uids']);
        $by = $this->attendanceService->currentPrincipal()?->name;

        foreach ($staff as $member) {
            $this->slips->generate($member, $by);
        }

        return back()->with('success', $staff->count() === 1
            ? "Salary slip generated for {$staff->first()->name}, up to now."
            : "{$staff->count()} salary slips generated, up to now.");
    }

    public function show(string $uid)
    {
        $slip = SalarySlip::where('uid', $uid)->firstOrFail();
        $principal = $this->attendanceService->currentPrincipal();

        $allowed = $this->attendanceService->isStaff($principal)
            ? $slip->staffable_type === get_class($principal) && $slip->staffable_id === $principal->id
            : $this->ownStaff()->contains(fn ($s) => get_class($s) === $slip->staffable_type && $s->id === $slip->staffable_id);
        abort_unless($allowed, 404);

        $staff = $slip->staffable;

        return Inertia::render('Admin/SalarySlips/Show', [
            'slip' => $this->slipSummary($slip) + [
                'salary' => $slip->salary,
                'salary_type' => $slip->salary_type,
                'shift' => $slip->shift,
                'days_leave' => $slip->days_leave,
                'days_absent' => $slip->days_absent,
                'hourly_rate' => $slip->hourly_rate,
                'deductions' => $slip->deductions ?? [],
                'total_deductions' => $slip->total_deductions,
                'generated_by' => $slip->generated_by,
                'generated_at' => $slip->generated_at?->format('d M Y, h:i A'),
            ],
            'staff' => [
                'name' => $slip->staff_name,
                'email' => $staff?->email,
                'phone' => $staff?->phone,
                'joining_date' => $staff?->staffProfile?->joining_date?->format('d M Y'),
            ],
            'company' => $this->slips->companyFor($slip),
            'isStaff' => $this->attendanceService->isStaff($principal),
        ]);
    }

    private function slipSummary(SalarySlip $slip): array
    {
        return [
            'uid' => $slip->uid,
            'period_label' => $slip->period_start && $slip->period_end
                ? $this->slips->periodLabel($slip->period_start, $slip->period_end)
                : $slip->month,
            'currency' => $slip->currency,
            'days_present' => $slip->days_present,
            'worked_minutes' => $slip->worked_minutes,
            'gross' => $slip->gross,
            'total_deductions' => $slip->total_deductions,
            'net' => $slip->net,
            'generated_at' => $slip->generated_at?->format('d M Y, h:i A'),
        ];
    }

    /** The session's own staff (an agency's, or the superadmin's), with what a slip needs. */
    private function ownStaff()
    {
        return $this->staffService->searchStaff('', 1000)->getCollection()
            ->load('staffPayment', 'staffTaxDeductions', 'staffTiming', 'staffProfile');
    }
}
