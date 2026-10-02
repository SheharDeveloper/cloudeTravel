import { Head, usePage } from '@inertiajs/react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import VisaRequirementsSearch, { type VisaRequirementsProps } from '@/components/VisaRequirementsSearch';
import EditingBookingBanner, { type EditingBooking } from '@/components/EditingBookingBanner';

export default function VisaSearch() {
    const { editing, ...props } = usePage().props as unknown as Omit<VisaRequirementsProps, 'basePath' | 'resultPath'> & {
        editing?: EditingBooking | null;
    };

    // While editing a booking, its uid (and Living In) go along to the next step
    const extraParams = editing
        ? { booking: editing.uid, ...(editing.living_in && { living_in: editing.living_in }) }
        : undefined;

    return (
        <ProtectedRoute>
            <Head title="Visa Requirements" />
            <div className="page-title mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Visas</h1></li>
                        <li className="breadcrumb-item">
                            <a href="/dashboard"><i className="fa fa-home me-2"></i>Dashboard</a>
                        </li>
                        <li className="breadcrumb-item active">Visas</li>
                    </ol>
                </nav>
            </div>
            {editing && <EditingBookingBanner booking={editing} />}
            <VisaRequirementsSearch
                {...props}
                basePath="/admin/visa-search"
                resultPath="/admin/visa-search/result"
                extraParams={extraParams}
            />
        </ProtectedRoute>
    );
}
