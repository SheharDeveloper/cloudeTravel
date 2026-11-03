import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

interface LunchTimer {
    started_label: string;
    due: string;
    due_label: string;
    allowed_minutes: number;
    overrun: boolean;
    now: string;
}

const WARN_SECONDS = 120;

/**
 * A staff member on lunch: two minutes before the lunch allowed (Staff
 * Settings) runs out, a reminder to press Lunch Out; once it has, everything
 * is blocked until an administrator approves their return. It checks every
 * few seconds and lifts as soon as they do.
 */
export default function LunchGate() {
    const { lunchTimer } = usePage().props as unknown as { lunchTimer: LunchTimer | null };
    const [now, setNow] = useState(() => Date.now());
    const [dismissed, setDismissed] = useState<string | null>(null);
    const [ending, setEnding] = useState(false);

    // The server's clock, not the browser's
    const offset = lunchTimer ? new Date(lunchTimer.now).getTime() - Date.now() : 0;
    const due = lunchTimer ? new Date(lunchTimer.due).getTime() : null;
    const remaining = due != null ? Math.ceil((due - (now + offset)) / 1000) : null;
    const blocked = !!lunchTimer && (lunchTimer.overrun || (remaining != null && remaining <= 0));

    useEffect(() => {
        if (due == null) return;
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, [due]);

    // Blocked: keep asking whether an administrator has approved the return
    useEffect(() => {
        if (!blocked) return;
        const id = window.setInterval(() => router.reload({ only: ['lunchTimer'] }), 15000);
        return () => window.clearInterval(id);
    }, [blocked]);

    if (!lunchTimer) return null;

    const lunchOut = () => {
        setEnding(true);
        router.post('/admin/attendance/lunch-end', {}, { preserveScroll: true, onFinish: () => setEnding(false) });
    };

    if (blocked) {
        return (
            <Overlay icon="fa-solid fa-utensils" color="#dc3545" title="Your lunch time is over">
                <p className="text-muted mb-1">
                    Your lunch break ({lunchTimer.allowed_minutes} min, from {lunchTimer.started_label}) ended at <strong>{lunchTimer.due_label}</strong>.
                </p>
                <p className="text-muted mb-4">
                    You can't continue until an administrator approves your return. <strong>Please contact your administrator.</strong>
                </p>
                <button type="button" className="btn btn-outline-primary w-100" onClick={() => router.reload({ only: ['lunchTimer'] })}>
                    <i className="fa fa-rotate me-1"></i>Check again
                </button>
                <small className="text-muted d-block mt-2">This checks by itself every few seconds.</small>
            </Overlay>
        );
    }

    if (remaining != null && remaining <= WARN_SECONDS && dismissed !== lunchTimer.due) {
        const mm = Math.floor(remaining / 60);
        const ss = String(remaining % 60).padStart(2, '0');
        return (
            <Overlay icon="fa-solid fa-utensils" color="#e6a700" title="Your lunch time is almost over">
                <div className="display-6 fw-bold mb-2" style={{ color: '#e6a700' }}>{mm}:{ss}</div>
                <p className="text-muted mb-4">
                    Press <strong>Lunch Out</strong> before <strong>{lunchTimer.due_label}</strong>. After that you'll need an administrator to approve your return.
                </p>
                <button type="button" className="btn btn-primary w-100 mb-2" onClick={lunchOut} disabled={ending}>
                    {ending ? 'Saving...' : 'Lunch Out now'}
                </button>
                <button type="button" className="btn btn-light w-100" onClick={() => setDismissed(lunchTimer.due)}>
                    Continue lunch
                </button>
            </Overlay>
        );
    }

    return null;
}

function Overlay({ icon, color, title, children }: { icon: string; color: string; title: string; children: React.ReactNode }) {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10001,
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
            }}
        >
            <div className="card" style={{ width: '100%', maxWidth: 440, height: 'auto', margin: 0 }}>
                <div className="card-body text-center py-4">
                    <i className={icon} style={{ fontSize: 44, color }}></i>
                    <h4 className="mt-3 mb-2">{title}</h4>
                    {children}
                </div>
            </div>
        </div>
    );
}
