<?php

namespace App\Http\Controllers;

use App\Services\AttendanceService;
use App\Services\StaffService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    protected AttendanceService $attendanceService;
    protected StaffService $staffService;

    public function __construct(AttendanceService $attendanceService, StaffService $staffService)
    {
        $this->attendanceService = $attendanceService;
        $this->staffService = $staffService;
    }

    public function index(Request $request)
    {
        $principal = $this->attendanceService->currentPrincipal();
        $isStaff = $this->attendanceService->isStaff($principal);
        $month = $request->get('month') ?: Date::today()->format('Y-m');

        $staffOptions = collect();
        $subject = $principal;

        if (!$isStaff) {
            $staffOptions = $this->staffService->searchStaff('', 1000)->getCollection();
            $selectedUid = $request->get('staff');
            $subject = $selectedUid ? $this->staffService->findByUid($selectedUid) : null;
        }

        return Inertia::render('Admin/Attendance/Index', [
            'isStaff' => $isStaff,
            'month' => $month,
            'staffOptions' => $isStaff ? null : $staffOptions->map(fn ($s) => [
                'uid' => $s->uid,
                'name' => $s->name,
            ])->values(),
            'selectedUid' => $isStaff ? null : $subject?->uid,
            'subjectName' => $subject?->name,
            'today' => $subject ? $this->attendanceService->todayDetail($subject) : null,
            'canCheckInOut' => $isStaff,
            'history' => $subject ? $this->attendanceService->monthlyHistory($subject, $month)->values() : [],
        ]);
    }

    public function store()
    {
        $this->attendanceService->markAttendance($this->attendanceService->currentPrincipal());

        // Stays on whatever page the modal was shown over — the
        // 'attendancePending' shared prop recalculates to false and the
        // modal/blur clears without navigating away.
        return back();
    }

    public function checkOut()
    {
        $this->attendanceService->checkOut($this->attendanceService->currentPrincipal());

        return back();
    }

    public function lunchStart()
    {
        $this->attendanceService->startLunch($this->attendanceService->currentPrincipal());

        return back();
    }

    public function lunchEnd()
    {
        $this->attendanceService->endLunch($this->attendanceService->currentPrincipal());

        return back();
    }

    /**
     * Staff applies for leave over a date range; sits pending until an
     * admin/owner approves or rejects it.
     */
    public function applyLeave(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:500',
            'leave_type_id' => 'nullable|integer|exists:leave_types,id',
        ]);

        $this->attendanceService->applyLeave(
            $this->attendanceService->currentPrincipal(),
            $validated['start_date'],
            $validated['end_date'],
            $validated['reason'],
            $validated['leave_type_id'] ?? null
        );

        return back()->with('success', 'Leave request submitted');
    }

    /**
     * Edit a leave request's dates/type/reason. A staff member may only
     * edit their own request while it's still pending; an admin/owner may
     * edit any request in scope, even after it's been decided.
     */
    public function updateLeave(Request $request, string $batchId)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:500',
            'leave_type_id' => 'nullable|integer|exists:leave_types,id',
            'status' => 'nullable|in:pending,approved,rejected',
        ]);

        $principal = $this->attendanceService->currentPrincipal();
        $isStaff = $this->attendanceService->isStaff($principal);

        $historyRow = \App\Models\AttendanceHistory::where('batch_id', $batchId)->first();
        abort_if(!$historyRow, 404);

        $staff = $isStaff ? $principal : $historyRow->staffable;

        try {
            $this->attendanceService->updateLeaveBatch(
                $staff,
                $batchId,
                $validated['start_date'],
                $validated['end_date'],
                $validated['reason'],
                $validated['leave_type_id'] ?? null,
                !$isStaff,
                $validated['status'] ?? null
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }

        return back()->with('success', 'Leave request updated');
    }

    /**
     * Admin/owner approves or rejects a staff member's leave request
     * (every day in the batch at once).
     */
    public function respondLeave(Request $request, string $uid)
    {
        $principal = $this->attendanceService->currentPrincipal();

        abort_if($this->attendanceService->isStaff($principal), 403);

        $validated = $request->validate([
            'batch_id' => 'required|uuid',
            'approve' => 'required|boolean',
        ]);

        $staff = $this->staffService->findByUid($uid);

        $this->attendanceService->respondToLeaveBatch($staff, $validated['batch_id'], (bool) $validated['approve']);

        return back();
    }

    /**
     * The Leave section: a staff member's own full leave history and the
     * form to apply for new leave — or, for an owner/superadmin, the same
     * table for whichever staff member is selected.
     */
    public function leaveIndex(Request $request)
    {
        $principal = $this->attendanceService->currentPrincipal();
        $isStaff = $this->attendanceService->isStaff($principal);

        $staffOptions = collect();
        $subject = $principal;

        if (!$isStaff) {
            $staffOptions = $this->staffService->searchStaff('', 1000)->getCollection();
            $selectedUid = $request->get('staff');
            $subject = $selectedUid ? $this->staffService->findByUid($selectedUid) : null;
        }

        return Inertia::render('Admin/Leave/Index', [
            'isStaff' => $isStaff,
            'staffOptions' => $isStaff ? null : $staffOptions->map(fn ($s) => [
                'uid' => $s->uid,
                'name' => $s->name,
            ])->values(),
            'selectedUid' => $isStaff ? null : $subject?->uid,
            'subjectName' => $subject?->name,
            'canApply' => $isStaff,
            'canManageLeaveTypes' => !$isStaff,
            'leaveTypes' => $this->attendanceService->leaveTypesForCurrentSession()->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'days' => $t->days,
            ])->values(),
            'leaveBalances' => $isStaff ? $this->attendanceService->leaveBalancesFor($principal)->values() : [],
            'leaves' => $subject
                ? $this->attendanceService->leaveHistoryFor($subject)->values()
                : (!$isStaff ? $this->attendanceService->allLeaveHistory()->values() : []),
        ]);
    }

    /**
     * Leave type CRUD — owner/superadmin only, scoped to their own session
     * (an agency manages its own types, a superadmin its own).
     */
    public function storeLeaveType(Request $request)
    {
        $principal = $this->attendanceService->currentPrincipal();

        abort_if($this->attendanceService->isStaff($principal), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'days' => 'required|integer|min:0|max:365',
        ]);

        $this->attendanceService->createLeaveType($validated['name'], $validated['days']);

        return back()->with('success', 'Leave type created');
    }

    public function updateLeaveType(Request $request, int $id)
    {
        $principal = $this->attendanceService->currentPrincipal();

        abort_if($this->attendanceService->isStaff($principal), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'days' => 'required|integer|min:0|max:365',
        ]);

        $type = $this->attendanceService->findLeaveType($id);
        $this->attendanceService->updateLeaveType($type, $validated['name'], $validated['days']);

        return back()->with('success', 'Leave type updated');
    }

    public function destroyLeaveType(int $id)
    {
        $principal = $this->attendanceService->currentPrincipal();

        abort_if($this->attendanceService->isStaff($principal), 403);

        $this->attendanceService->deleteLeaveType($this->attendanceService->findLeaveType($id));

        return back()->with('success', 'Leave type deleted');
    }

    /**
     * Pending leave requests for the current session's staff, for the
     * dedicated Leave Requests page.
     */
    public function leaveRequests()
    {
        $principal = $this->attendanceService->currentPrincipal();

        abort_if($this->attendanceService->isStaff($principal), 403);

        return Inertia::render('Admin/LeaveRequests/Index', [
            'requests' => $this->attendanceService->pendingLeaveRequests(),
        ]);
    }

    /**
     * Admin correction of a staff member's day: only an owner/superadmin
     * may edit someone else's attendance — never their own via this route.
     */
    public function updateDay(Request $request, string $uid)
    {
        $principal = $this->attendanceService->currentPrincipal();

        abort_if($this->attendanceService->isStaff($principal), 403);

        $validated = $request->validate([
            'date' => 'required|date',
            'checked_in_time' => 'nullable|date_format:H:i',
            'checked_out_time' => 'nullable|date_format:H:i',
            'clear_checkout' => 'boolean',
            'status' => 'nullable|in:present,half_day,leave,absent',
            'work_type' => 'nullable|in:office,remote,field',
        ]);

        $staff = $this->staffService->findByUid($uid);

        $this->attendanceService->updateDay(
            $staff,
            $validated['date'],
            $validated['checked_in_time'] ?? null,
            $validated['checked_out_time'] ?? null,
            (bool) ($validated['clear_checkout'] ?? false),
            $validated['status'] ?? null,
            $validated['work_type'] ?? null
        );

        return back();
    }
}
