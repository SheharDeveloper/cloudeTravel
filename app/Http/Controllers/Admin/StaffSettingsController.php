<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AgencyUser;
use App\Models\User;
use App\Services\AttendanceService;
use App\Services\StaffService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Staff Settings: the default working hours — shift start and end, the lunch
 * allowed and working days a month — that every staff member works to, and
 * any staff member's own hours where they differ. Attendance uses them for
 * hours worked, the day's pay, late starts and lunches that ran over.
 * An agency sees its own staff and default; the superadmin its own.
 */
class StaffSettingsController extends Controller
{
    public function __construct(protected StaffService $staffService, protected AttendanceService $attendance)
    {
    }

    public function index()
    {
        $default = $this->staffService->defaultTiming();

        return Inertia::render('Admin/StaffSettings/Index', [
            'defaults' => [
                'shift_start' => $default?->shift_start ? substr($default->shift_start, 0, 5) : '',
                'shift_end' => $default?->shift_end ? substr($default->shift_end, 0, 5) : '',
                'lunch_minutes' => $default?->lunch_minutes,
                'working_days' => $default?->working_days,
            ],
            'staff' => $this->ownStaff()
                ->map(fn (User|AgencyUser $s) => [
                    'uid' => $s->uid,
                    'name' => $s->name,
                    'email' => $s->email,
                    'photo' => $s->profile_pic ? $s->profile_image_url : null,
                    'salary' => $s->staffPayment?->salary !== null ? (float) $s->staffPayment->salary : null,
                    'salary_type' => $s->staffPayment?->salary_type ?? 'per_month',
                    'currency' => $s->staffPayment?->currency,
                    'shift_start' => $s->staffTiming?->shift_start ? substr($s->staffTiming->shift_start, 0, 5) : '',
                    'shift_end' => $s->staffTiming?->shift_end ? substr($s->staffTiming->shift_end, 0, 5) : '',
                    'lunch_minutes' => $s->staffTiming?->lunch_minutes,
                    'working_days' => $s->staffTiming?->working_days,
                    'today' => $this->today($s),
                ])
                ->values(),
        ]);
    }

    /**
     * Where the staff member's day stands, for the Extend button: when their
     * working hours end, whether that's passed (they can't sign in), and
     * checked in / checked out (and whether automatically).
     */
    private function today(User|AgencyUser $staff): ?array
    {
        $this->attendance->enforceTimeLimit($staff);
        $endsAt = $this->attendance->endsAt($staff);
        $day = $this->attendance->todayFor($staff);
        if (! $endsAt && ! $day?->checked_in_at) {
            return null;
        }

        return [
            'ends_at' => $endsAt?->format('h:i A'),
            'hours_over' => $endsAt !== null && now()->greaterThanOrEqualTo($endsAt),
            'checked_in_at' => $day?->checked_in_at?->format('h:i A'),
            'checked_out_at' => $day?->checked_out_at?->format('h:i A'),
            'auto_checked_out' => $day?->auto_checked_out_at !== null,
            'extended_minutes' => $this->attendance->extensionMinutes($staff, now()->toDateString()),
        ];
    }

    /** Saves one staff member's working hours. */
    public function update(Request $request, string $uid)
    {
        $staff = $this->ownStaff()->firstWhere('uid', $uid);
        abort_unless($staff, 404);

        $this->staffService->syncTiming($staff, $this->validateTiming($request));

        return back()->with('success', "Working hours saved for {$staff->name}.");
    }

    /** Saves the default working hours every staff member uses unless they have their own. */
    public function updateDefault(Request $request)
    {
        $this->staffService->syncDefaultTiming($this->validateTiming($request));

        return back()->with('success', 'Default working hours saved for all staff.');
    }

    private function validateTiming(Request $request): array
    {
        return $request->validate([
            'shift_start' => 'nullable|date_format:H:i|required_with:shift_end',
            'shift_end' => 'nullable|date_format:H:i|required_with:shift_start|after:shift_start',
            'lunch_minutes' => 'nullable|integer|min:0|max:240',
            'working_days' => 'nullable|integer|min:1|max:31',
        ], [
            'shift_end.after' => 'The end time must be after the start time.',
        ]);
    }

    /** The session's own staff (an agency's staff, or the superadmin's), with their timing and salary. */
    private function ownStaff()
    {
        return $this->staffService->searchStaff('', 1000)->getCollection()->load('staffTiming', 'staffPayment');
    }
}
