import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

interface TimerState {
    deadline: string | null;
    deadline_label: string | null;
    now: string;
}

/**
 * Staff top bar: time left until the automatic check-out (and sign-out) —
 * the end of their working hours plus any extension. Green, amber under 30
 * minutes, red under 5. Nothing once checked out or with no hours set.
 */
export default function ShiftCountdown() {
    const { attendanceTimer } = usePage().props as unknown as { attendanceTimer: TimerState | null };
    const [now, setNow] = useState(() => Date.now());

    const deadline = attendanceTimer?.deadline ? new Date(attendanceTimer.deadline).getTime() : null;
    // The server's clock, not the browser's
    const offset = attendanceTimer ? new Date(attendanceTimer.now).getTime() - Date.now() : 0;

    useEffect(() => {
        if (deadline == null) return;
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, [deadline]);

    if (deadline == null) return null;

    const left = Math.max(Math.ceil((deadline - (now + offset)) / 1000), 0);
    const h = Math.floor(left / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = left % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    const color = left <= 300 ? '#dc3545' : left <= 1800 ? '#e6a700' : '#198754';

    return (
        <li className="nav-item">
            <div
                className="d-flex align-items-center gap-2 bg-white rounded-3 mx-1 px-3"
                style={{ height: 44, border: `1px solid ${color}33` }}
                title={`You'll be checked out and signed out automatically at ${attendanceTimer?.deadline_label}`}
            >
                <i className="fa-solid fa-hourglass-half" style={{ color }}></i>
                <div className="lh-1">
                    <div className="text-muted" style={{ fontSize: 10 }}>Logout in</div>
                    <div className="fw-bold" style={{ color, fontVariantNumeric: 'tabular-nums', fontSize: 15 }}>
                        {left > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : "Time's up"}
                    </div>
                </div>
            </div>
        </li>
    );
}
