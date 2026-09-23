import { Head, usePage } from '@inertiajs/react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import VisaRequirementsSearch, { type VisaRequirementsProps } from '@/components/VisaRequirementsSearch';

export default function VisaSearch() {
    const props = usePage().props as unknown as Omit<VisaRequirementsProps, 'basePath' | 'resultPath'>;

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
            <VisaRequirementsSearch {...props} basePath="/admin/visa-search" resultPath="/admin/visa-search/result" />
        </ProtectedRoute>
    );
}
