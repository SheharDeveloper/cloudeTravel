import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function AttendanceGate() {
    const { attendancePending, auth } = usePage().props as any;
    const [loading, setLoading] = useState(false);

    if (!attendancePending) {
        return null;
    }

    const name = auth?.user?.name || 'there';

    const handleMark = () => {
        setLoading(true);
        router.post('/attendance/mark', {}, {
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div className="card" style={{ width: '100%', maxWidth: 420, height: 'auto', margin: 0 }}>
                <div className="card-body text-center py-4">
                    <i className="fa fa-calendar-check" style={{ fontSize: 48, color: '#452B90' }}></i>

                    <h4 className="mt-3 mb-2">Welcome, {name}!</h4>
                    <p className="mb-4 text-muted">
                        You need to mark today's attendance before you can continue.
                    </p>

                    <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={handleMark}
                        disabled={loading}
                    >
                        {loading ? 'Marking...' : 'Mark Attendance'}
                    </button>
                </div>
            </div>
        </div>
    );
}
