/** Shown on the visa steps while "Edit" on a booking walks through them again. */
export interface EditingBooking {
    uid: string;
    invoice_number: string;
    visa_uid: string | null;
    living_in: string | null;
    // Edit (anything) or Amendment (only the date, country and visa)
    mode?: 'edit' | 'amend';
}

/** The EDIT / AMENDMENT flag shown on every step of the change. */
export function ChangeFlag({ mode }: { mode?: 'edit' | 'amend' }) {
    return mode === 'amend' ? (
        <span className="badge bg-warning text-dark me-2" style={{ fontSize: 12, letterSpacing: 0.5 }}>
            <i className="fa-solid fa-file-signature me-1"></i>AMENDMENT
        </span>
    ) : (
        <span className="badge bg-info text-white me-2" style={{ fontSize: 12, letterSpacing: 0.5 }}>
            <i className="fa-regular fa-pen-to-square me-1"></i>EDIT
        </span>
    );
}

export default function EditingBookingBanner({ booking }: { booking: EditingBooking }) {
    return (
        <div className={`alert ${booking.mode === 'amend' ? 'alert-warning' : 'alert-info'} d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4`}>
            <span>
                <ChangeFlag mode={booking.mode} />
                {booking.mode === 'amend' ? (
                    <>
                        Amending invoice <strong>{booking.invoice_number}</strong>. Only the date, country and visa can change — the client and applicants stay the same.
                    </>
                ) : (
                    <>
                        Editing booking <strong>{booking.invoice_number}</strong>. Choose the countries and visa, then save your changes on the last step.
                    </>
                )}
            </span>
            <a href={`/admin/service-bookings/${booking.uid}`} className="btn btn-sm btn-outline-secondary">
                Cancel editing
            </a>
        </div>
    );
}
