<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AttendanceService;
use App\Services\StaffService;
use App\Services\TaskService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    protected TaskService $taskService;
    protected StaffService $staffService;
    protected AttendanceService $attendanceService;

    public function __construct(TaskService $taskService, StaffService $staffService, AttendanceService $attendanceService)
    {
        $this->taskService = $taskService;
        $this->staffService = $staffService;
        $this->attendanceService = $attendanceService;
    }

    public function index()
    {
        $principal = $this->attendanceService->currentPrincipal();
        $isStaff = $this->attendanceService->isStaff($principal);

        $staffOptions = $isStaff
            ? collect()
            : $this->staffService->searchStaff('', 1000)->getCollection();

        $board = $this->taskService->boardForCurrentSession();

        return Inertia::render('Admin/Tasks/Index', [
            'isStaff' => $isStaff,
            'canManageTasks' => !$isStaff,
            'currentStaffUid' => $isStaff ? $principal->uid : null,
            'staffOptions' => $staffOptions->map(fn ($s) => [
                'uid' => $s->uid,
                'name' => $s->name,
            ])->values(),
            'statuses' => $this->taskService->statuses(),
            'priorities' => $this->taskService->priorities(),
            'tasks' => $board['tasks'],
            'history' => $board['history'],
        ]);
    }

    public function show(string $uid)
    {
        $task = $this->taskService->findTask($uid);
        $principal = $this->attendanceService->currentPrincipal();
        $isStaff = $this->attendanceService->isStaff($principal);

        $staffOptions = $isStaff
            ? collect()
            : $this->staffService->searchStaff('', 1000)->getCollection();

        return Inertia::render('Admin/Tasks/Show', [
            'task' => $this->taskService->presentDetail($task),
            'isStaff' => $isStaff,
            'canManageTasks' => !$isStaff,
            'currentStaffUid' => $isStaff ? $principal->uid : null,
            'staffOptions' => $staffOptions->map(fn ($s) => [
                'uid' => $s->uid,
                'name' => $s->name,
            ])->values(),
            'statuses' => $this->taskService->statuses(),
            'priorities' => $this->taskService->priorities(),
        ]);
    }

    public function store(Request $request)
    {
        abort_if($this->attendanceService->isStaff($this->attendanceService->currentPrincipal()), 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'details' => 'nullable|string|max:5000',
            'priority' => 'required|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'status' => 'nullable|in:todo,in_progress,review,done',
            'assigned_to' => 'nullable|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,xlsx,zip|max:10240',
        ]);

        $principal = $this->attendanceService->currentPrincipal();
        $assignedTo = !empty($validated['assigned_to']) ? $this->staffService->findByUid($validated['assigned_to']) : null;

        $task = $this->taskService->createTask($validated, $principal, $assignedTo);

        if ($request->hasFile('attachments')) {
            $this->taskService->storeAttachments($task, $request->file('attachments'));
        }

        return back()->with('success', 'Task created');
    }

    public function update(Request $request, string $uid)
    {
        $principal = $this->attendanceService->currentPrincipal();

        abort_if($this->attendanceService->isStaff($principal), 403);

        $task = $this->taskService->findTask($uid);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'details' => 'nullable|string|max:5000',
            'priority' => 'required|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,xlsx,zip|max:10240',
        ]);

        $assignedTo = !empty($validated['assigned_to']) ? $this->staffService->findByUid($validated['assigned_to']) : null;

        $this->taskService->updateTask($task, $validated, $assignedTo, $principal);

        if ($request->hasFile('attachments')) {
            $this->taskService->storeAttachments($task, $request->file('attachments'));
        }

        return back()->with('success', 'Task updated');
    }

    /**
     * Move a task between board columns — the assignee may update their own
     * task's status, an admin/owner may update any task in scope.
     */
    public function updateStatus(Request $request, string $uid)
    {
        $task = $this->taskService->findTask($uid);
        $principal = $this->attendanceService->currentPrincipal();
        $isStaff = $this->attendanceService->isStaff($principal);

        abort_if($isStaff && !$this->taskService->isAssignee($task, $principal), 403);

        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,review,done',
        ]);

        $this->taskService->updateStatus($task, $validated['status']);

        return back();
    }

    /**
     * Assign or unassign a task. Staff may only assign an unassigned task
     * to themselves, or unassign a task assigned to themselves; an
     * admin/owner may assign or unassign any task in scope to anyone.
     */
    public function assign(Request $request, string $uid)
    {
        $task = $this->taskService->findTask($uid);
        $principal = $this->attendanceService->currentPrincipal();
        $isStaff = $this->attendanceService->isStaff($principal);

        $validated = $request->validate([
            'assigned_to' => 'nullable|string',
        ]);

        $targetUid = $validated['assigned_to'] ?? null;

        if ($isStaff) {
            if ($targetUid) {
                abort_if($targetUid !== $principal->uid || $task->assigned_to_id !== null, 403);
                $assignee = $principal;
            } else {
                abort_if(!$this->taskService->isAssignee($task, $principal), 403);
                $assignee = null;
            }
        } else {
            $assignee = $targetUid ? $this->staffService->findByUid($targetUid) : null;
        }

        $this->taskService->assignTask($task, $assignee, $principal);

        return back();
    }

    /**
     * Add a note to a task — the assignee may note their own task, an
     * admin/owner may note any task in scope.
     */
    public function storeNote(Request $request, string $uid)
    {
        $task = $this->taskService->findTask($uid);
        $principal = $this->attendanceService->currentPrincipal();
        $isStaff = $this->attendanceService->isStaff($principal);

        abort_if($isStaff && !$this->taskService->isAssignee($task, $principal), 403);

        $validated = $request->validate([
            'note' => 'required|string|max:2000',
        ]);

        $this->taskService->addNote($task, $principal, $validated['note']);

        return back()->with('success', 'Note added');
    }

    /**
     * Add/update the remark — the assignee may leave a remark on their own
     * task, an admin/owner may remark on any task in scope.
     */
    public function updateRemark(Request $request, string $uid)
    {
        $task = $this->taskService->findTask($uid);
        $principal = $this->attendanceService->currentPrincipal();
        $isStaff = $this->attendanceService->isStaff($principal);

        abort_if($isStaff && !$this->taskService->isAssignee($task, $principal), 403);

        $validated = $request->validate([
            'remark' => 'nullable|string|max:2000',
        ]);

        $this->taskService->updateRemark($task, $validated['remark'] ?? null);

        return back();
    }

    /**
     * Attach a file — the assignee may add evidence to their own task, an
     * admin/owner may attach to any task in scope.
     */
    public function storeAttachment(Request $request, string $uid)
    {
        $task = $this->taskService->findTask($uid);
        $principal = $this->attendanceService->currentPrincipal();
        $isStaff = $this->attendanceService->isStaff($principal);

        abort_if($isStaff && !$this->taskService->isAssignee($task, $principal), 403);

        $validated = $request->validate([
            'attachments' => 'required|array',
            'attachments.*' => 'file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,xlsx,zip|max:10240',
        ]);

        $this->taskService->storeAttachments($task, $validated['attachments']);

        return back()->with('success', 'Attachment added');
    }

    public function destroyAttachment(string $uid, int $attachmentId)
    {
        $task = $this->taskService->findTask($uid);
        $principal = $this->attendanceService->currentPrincipal();
        $isStaff = $this->attendanceService->isStaff($principal);

        abort_if($isStaff && !$this->taskService->isAssignee($task, $principal), 403);

        $attachment = $task->attachments()->findOrFail($attachmentId);

        $this->taskService->deleteAttachment($attachment);

        return back();
    }

    public function destroy(string $uid)
    {
        $principal = $this->attendanceService->currentPrincipal();

        abort_if($this->attendanceService->isStaff($principal), 403);

        $this->taskService->deleteTask($this->taskService->findTask($uid));

        return back()->with('success', 'Task deleted');
    }
}
