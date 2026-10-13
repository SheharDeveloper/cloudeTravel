import { usePage } from '@inertiajs/react';
import ClientLayout from '@/layouts/client/ClientLayout';
import { ApplicationView } from '@/pages/Admin/ServiceBookings/ApplicationShow';

/**
 * View Application on the client portal: the same page the agency sees —
 * fill the form and upload the requested documents — without Send to Admin,
 * Send Email or the log.
 */
export default function ClientApplicationShow() {
    const { application } = usePage().props as unknown as { application: { application_number: string } };

    return (
        <ClientLayout title={`Application ${application.application_number}`}>
            <div className="mb-3">
                <a href="/client/bookings" className="btn btn-outline-primary btn-sm">
                    <i className="fa fa-arrow-left me-2"></i>My Bookings
                </a>
            </div>
            <ApplicationView portal="client" />
        </ClientLayout>
    );
}
