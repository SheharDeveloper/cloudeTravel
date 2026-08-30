<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\AgencyUser;
use App\Models\Task;
use App\Models\TaskActivityLog;
use App\Models\TaskAttachment;
use App\Models\TaskNote;
use App\Models\User;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class TaskService
{
    private const STATUSES = ['todo', 'in_progress', 'review', 'done'];

    private const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

    public function statuses(): array
    {
        return self::STATUSES;
    }

    public function priorities(): array
    {
        return self::PRIORITIES;
    }

    /**
     * Owner attributes for the current session: the signed-in agency, or
     * null for a superadmin session.
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
     * True if this task belongs to the current session (its own agency, or
     * its own superadmin-side tasks).
     */
    private function ownedByCurrentSession(Task $task): bool
    {
        $owner = $this->currentOwnerAttributes();

        return $task->owner_type === $owner['owner_type'] && $task->owner_id === $owner['owner_id'];
    }

    /**
     * The board for the current session, split into two groups:
     *  - 'tasks': the active board — To Do / In Progress / Review show
     *    every task in that status, but Done only shows tasks completed
     *    today, so the board doesn't pile up with old finished work.
     *  - 'history': tasks completed earlier this month — always visible
     *    at the bottom instead of disappearing once the day is over.
     */
    public function boardForCurrentSession(): array
    {
        $owner = $this->currentOwnerAttributes();
        $today = now()->startOfDay();
        $monthStart = now()->startOfMonth();

        $all = Task::where('owner_type', $owner['owner_type'])
            ->where('owner_id', $owner['owner_id'])
            ->with(['assignedTo', 'createdBy', 'attachments', 'notes.author'])
            ->orderByDesc('created_at')
            ->get();

        $isDoneToday = fn (Task $task) => $task->status === 'done'
            && $task->status_updated_at
            && $task->status_updated_at->greaterThanOrEqualTo($today);

        $isDoneEarlierThisMonth = fn (Task $task) => $task->status === 'done'
            && $task->status_updated_at
            && $task->status_updated_at->lessThan($today)
            && $task->status_updated_at->greaterThanOrEqualTo($monthStart);

        $tasks = $all->filter(fn (Task $task) => $task->status !== 'done' || $isDoneToday($task));
        $history = $all->filter($isDoneEarlierThisMonth);

        return [
            'tasks' => $tasks->map(fn (Task $task) => $this->present($task))->values(),
            'history' => $history->map(fn (Task $task) => $this->present($task))->values(),
        ];
    }

    private function present(Task $task): array
    {
        return [
            'uid' => $task->uid,
            'title' => $task->title,
            'details' => $task->details,
            'priority' => $task->priority,
            'due_date' => $task->due_date?->format('Y-m-d'),
            'status' => $task->status,
            'remark' => $task->remark,
            'assigned_to_uid' => $task->assignedTo?->uid,
            'assigned_to_name' => $task->assignedTo?->name,
            'created_by_name' => $task->createdBy?->name,
            'created_at' => $task->created_at->format('M d, Y'),
            'status_updated_at' => $task->status_updated_at?->format('M d, Y h:i A'),
            'attachments' => $task->attachments->map(fn (TaskAttachment $a) => [
                'id' => $a->id,
                'file_name' => $a->file_name,
                'file_path' => $a->file_path,
                'file_type' => $a->file_type,
            ])->values(),
            'notes' => $task->notes->sortByDesc('created_at')->map(fn (TaskNote $n) => [
                'id' => $n->id,
                'note' => $n->note,
                'author_name' => $n->author?->name,
                'created_at' => $n->created_at->format('M d, Y h:i A'),
            ])->values(),
        ];
    }

    /**
     * Fetch a task the current session is allowed to see.
     */
    public function findTask(string $uid): Task
    {
        $task = Task::with(['assignedTo', 'createdBy', 'attachments'])->where('uid', $uid)->firstOrFail();

        if (!$this->ownedByCurrentSession($task)) {
            throw new Exception('You do not have permission to access this task.');
        }

        return $task;
    }

    /**
     * Full detail payload for the task detail page: the board fields plus
     * its notes and its assignment history (who assigned/reassigned it to
     * whom, and who unassigned it).
     */
    public function presentDetail(Task $task): array
    {
        $task->load(['notes.author', 'activityLogs.causer']);

        return $this->present($task) + [
            'assignment_history' => $task->activityLogs->sortByDesc('created_at')->map(fn (TaskActivityLog $l) => [
                'id' => $l->id,
                'action' => $l->action,
                'description' => $l->description,
                'causer_name' => $l->causer?->name,
                'created_at' => $l->created_at->format('M d, Y h:i A'),
            ])->values(),
        ];
    }

    /**
     * Record an entry in the task's assignment history — who assigned or
     * unassigned it, and to whom.
     */
    private function logActivity(Task $task, User|AgencyUser|null $causer, string $action, string $description): void
    {
        TaskActivityLog::create([
            'task_id' => $task->id,
            'causer_type' => $causer ? get_class($causer) : null,
            'causer_id' => $causer?->id,
            'action' => $action,
            'description' => $description,
        ]);
    }

    public function addNote(Task $task, User|AgencyUser $author, string $note): TaskNote
    {
        return TaskNote::create([
            'task_id' => $task->id,
            'author_type' => get_class($author),
            'author_id' => $author->id,
            'note' => $note,
        ]);
    }

    /**
     * True if this staff member is the task's assignee — staff may update
     * status/remark/attachments only on their own assigned tasks.
     */
    public function isAssignee(Task $task, User|AgencyUser $staff): bool
    {
        return $task->assigned_to_type === get_class($staff) && $task->assigned_to_id === $staff->id;
    }

    public function createTask(array $data, User|AgencyUser $creator, User|AgencyUser|null $assignedTo): Task
    {
        $task = Task::create($this->currentOwnerAttributes() + [
            'title' => $data['title'],
            'details' => $data['details'] ?? null,
            'priority' => $data['priority'] ?? 'medium',
            'due_date' => $data['due_date'] ?? null,
            'status' => $data['status'] ?? 'todo',
            'assigned_to_type' => $assignedTo ? get_class($assignedTo) : null,
            'assigned_to_id' => $assignedTo?->id,
            'created_by_type' => get_class($creator),
            'created_by_id' => $creator->id,
        ]);

        if ($assignedTo) {
            $this->logActivity($task, $creator, 'assigned', "Assigned to \"{$assignedTo->name}\" by \"{$creator->name}\"");
        }

        return $task;
    }

    public function updateTask(Task $task, array $data, User|AgencyUser|null $assignedTo, User|AgencyUser $causer): Task
    {
        $dueDate = $data['due_date'] ?? null;
        $removingDueDate = $task->due_date !== null && !$dueDate;
        $previousAssigneeId = $task->assigned_to_id;
        $previousAssigneeType = $task->assigned_to_type;

        $updates = [
            'title' => $data['title'],
            'details' => $data['details'] ?? null,
            'priority' => $data['priority'] ?? $task->priority,
            'due_date' => $dueDate,
            'assigned_to_type' => $assignedTo ? get_class($assignedTo) : null,
            'assigned_to_id' => $assignedTo?->id,
        ];

        // Clearing the due date reopens the task back into To Do — it's no
        // longer on a schedule, so it goes back to the unstarted backlog.
        if ($removingDueDate && $task->status !== 'todo') {
            $updates['status'] = 'todo';
            $updates['status_updated_at'] = now();
        }

        $task->update($updates);

        $reassigned = $previousAssigneeType !== $updates['assigned_to_type'] || $previousAssigneeId !== $updates['assigned_to_id'];
        if ($reassigned) {
            if ($assignedTo) {
                $this->logActivity($task, $causer, 'assigned', "Assigned to \"{$assignedTo->name}\" by \"{$causer->name}\"");
            } else {
                $this->logActivity($task, $causer, 'unassigned', "Unassigned by \"{$causer->name}\"");
            }
        }

        return $task->fresh(['assignedTo', 'createdBy', 'attachments']);
    }

    /**
     * Assign or unassign a task. A staff member may only assign an
     * unassigned task to themselves, or unassign a task assigned to
     * themselves; an admin/owner may assign/unassign any task in scope to
     * anyone.
     */
    public function assignTask(Task $task, User|AgencyUser|null $assignee, User|AgencyUser $causer): Task
    {
        $task->update([
            'assigned_to_type' => $assignee ? get_class($assignee) : null,
            'assigned_to_id' => $assignee?->id,
        ]);

        if ($assignee) {
            $this->logActivity($task, $causer, 'assigned', "Assigned to \"{$assignee->name}\" by \"{$causer->name}\"");
        } else {
            $this->logActivity($task, $causer, 'unassigned', "Unassigned by \"{$causer->name}\"");
        }

        return $task->fresh(['assignedTo', 'createdBy', 'attachments']);
    }

    public function updateStatus(Task $task, string $status): Task
    {
        $task->update(['status' => $status, 'status_updated_at' => now()]);

        return $task->fresh(['assignedTo', 'createdBy', 'attachments']);
    }

    public function updateRemark(Task $task, ?string $remark): Task
    {
        $task->update(['remark' => $remark]);

        return $task->fresh(['assignedTo', 'createdBy', 'attachments']);
    }

    public function deleteTask(Task $task): bool
    {
        foreach ($task->attachments as $attachment) {
            $this->deleteAttachment($attachment);
        }

        return (bool) $task->delete();
    }

    public function storeAttachments(Task $task, array $files): void
    {
        foreach ($files as $file) {
            if (!$file instanceof UploadedFile) {
                continue;
            }

            TaskAttachment::create([
                'task_id' => $task->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => '/storage/' . $file->store('task-attachments', 'public'),
                'file_type' => $file->getClientOriginalExtension(),
            ]);
        }
    }

    public function deleteAttachment(TaskAttachment $attachment): bool
    {
        $relativePath = preg_replace('#^/storage/#', '', $attachment->file_path);
        \Illuminate\Support\Facades\Storage::disk('public')->delete($relativePath);

        return (bool) $attachment->delete();
    }
}
