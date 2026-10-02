/** Shown on the visa steps while "Edit" on a booking walks through them again. */
export interface EditingBooking {
    uid: string;
    invoice_number: string;
    visa_uid: string | null;
    living_in: string | null;
}

export default function EditingBookingBanner({ booking }: { booking: EditingBooking }) {
    return (
        <div className="alert alert-info d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
            <span>
                <i className="fa-regular fa-pen-to-square me-2"></i>
                Editing booking <strong>{booking.invoice_number}</strong>. Choose the countries and visa, then save your changes on the last step.
            </span>
            <a href={`/admin/service-bookings/${booking.uid}`} className="btn btn-sm btn-outline-secondary">
                Cancel editing
            </a>
        </div>
    );
}
