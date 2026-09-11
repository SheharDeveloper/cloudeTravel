interface AlertBellProps {
    alerts: string[];
}

/**
 * A bell icon that turns red and lists warnings in a dropdown when
 * `alerts` is non-empty (e.g. expiring passport/visa, missing salary).
 * Pass a different `alerts` list to reuse this on any other page.
 */
export default function AlertBell({ alerts }: AlertBellProps) {
    const hasAlerts = alerts.length > 0;

    return (
        <div className="dropdown">
            <button
                type="button"
                className={`btn btn-sm ${hasAlerts ? 'btn-danger' : 'btn-outline-secondary'} rounded-circle position-relative`}
                style={{ width: 36, height: 36 }}
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title={hasAlerts ? `${alerts.length} alert(s)` : 'No alerts'}
            >
                <i className="fa fa-bell"></i>
                {hasAlerts && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning border border-light">
                        {alerts.length}
                    </span>
                )}
            </button>
            <div className="dropdown-menu dropdown-menu-end p-2" style={{ minWidth: 260 }}>
                {hasAlerts ? (
                    alerts.map((alert, i) => (
                        <div key={i} className={`d-flex align-items-start gap-2 p-2 ${i < alerts.length - 1 ? 'border-bottom' : ''}`}>
                            <i className="fa fa-triangle-exclamation text-danger mt-1"></i>
                            <span className="small">{alert}</span>
                        </div>
                    ))
                ) : (
                    <div className="p-2 text-muted small text-center">No alerts</div>
                )}
            </div>
        </div>
    );
}
