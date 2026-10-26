import { useEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

interface TimerState {
    deadline: string | null;
    deadline_label: string | null;
    auto_checked_out: boolean;
    checked_out_label: string | null;
    date: string;
    now: string;
}

const WARN_SECONDS = 120;

const storage = {
    get: (key: string) => { try { return sessionStorage.getItem(key); } catch { return null; } },
    set: (key: string, value: string) => { try { sessionStorage.setItem(key, value); } catch { /* private mode */ } },
};

/**
 * A staff member's day ends when their shift length has passed since
 * check-in. Two minutes before, a warning with Continue; when it's up, they're
 * checked out (the server decides) and told to ask an administrator for more time.
 */
export default function AttendanceTimer() {
    const { attendanceTimer } = usePage().props as unknown as { attendanceTimer: TimerState | null };
    const [now, setNow] = useState(() => Date.now());
    const [warnDismissed, setWarnDismissed] = useState<string | null>(null);
    const [doneDismissed, setDoneDismissed] = useState(false);
    const posted = useRef<string | null>(null);

    // The server's clock, not the browser's
    const offset = attendanceTimer ? new Date(attendanceTimer.now).getTime() - Date.now() : 0;
    const deadline = attendanceTimer?.deadline ? new Date(attendanceTimer.deadline).getTime() : null;
    const remaining = deadline != null ? Math.ceil((deadline - (now + offset)) / 1000) : null;

    useEffect(() => {
        if (deadline == null) return;
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, [deadline]);

    // Time's up: ask the server to check out (once per deadline)
    useEffect(() => {
        if (remaining == null || remaining > 0 || !attendanceTimer?.deadline || posted.current === attendanceTimer.deadline) return;
        posted.current = attendanceTimer.deadline;
        router.post('/admin/attendance/auto-check-out', {}, { preserveScroll: true, preserveState: true });
    }, [remaining, attendanceTimer?.deadline]);

    // The "checked out" popup shows once per day in this browser tab
    const doneKey = attendanceTimer ? `attendance-auto-checkout-${attendanceTimer.date}` : '';
    useEffect(() => {
        setDoneDismissed(!!doneKey && storage.get(doneKey) === '1');
    }, [doneKey]);

    if (!attendanceTimer) return null;

    if (attendanceTimer.auto_checked_out && !doneDismissed) {
        return (
            <Popup icon="fa-solid fa-user-clock" color="#dc3545" title="You've been checked out">
                <p className="text-muted mb-1">
                    Your shift time limit was reached, so you were checked out automatically
                    {attendanceTimer.checked_out_label ? <> at <strong>{attendanceTimer.checked_out_label}</strong></> : null}.
                </p>
                <p className="text-muted mb-4">If you want more time, please contact your administrator.</p>
                <button type="button" className="btn btn-primary w-100" onClick={() => { storage.set(doneKey, '1'); setDoneDismissed(true); }}>
                    OK
                </button>
            </Popup>
        );
    }

    if (remaining != null && remaining > 0 && remaining <= WARN_SECONDS && warnDismissed !== attendanceTimer.deadline) {
        const mm = Math.floor(remaining / 60);
        const ss = String(remaining % 60).padStart(2, '0');
        return (
            <Popup icon="fa-solid fa-hourglass-half" color="#452B90" title="Your shift time is almost over">
                <div className="display-6 fw-bold mb-2" style={{ color: '#452B90' }}>{mm}:{ss}</div>
                <p className="text-muted mb-1">
                    You'll be checked out automatically at <strong>{attendanceTimer.deadline_label}</strong>.
                </p>
                <p className="text-muted mb-4">If you want more time, please contact your administrator.</p>
                <button type="button" className="btn btn-primary w-100" onClick={() => setWarnDismissed(attendanceTimer.deadline)}>
                    Continue
                </button>
            </Popup>
        );
    }

    return null;
}

function Popup({ icon, color, title, children }: { icon: string; color: string; title: string; children: React.ReactNode }) {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
            }}
        >
            <div className="card" style={{ width: '100%', maxWidth: 420, height: 'auto', margin: 0 }}>
                <div className="card-body text-center py-4">
                    <i className={icon} style={{ fontSize: 44, color }}></i>
                    <h4 className="mt-3 mb-2">{title}</h4>
                    {children}
                </div>
            </div>
        </div>
    );
}
