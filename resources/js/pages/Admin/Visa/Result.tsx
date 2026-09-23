import { Head, usePage } from '@inertiajs/react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import VisaResultView, { type VisaResultProps } from '@/components/VisaResultView';

export default function VisaResult() {
    const { isPreview, ...props } = usePage().props as unknown as Omit<VisaResultProps, 'resultPath'> & { isPreview?: boolean };

    return (
        <ProtectedRoute>
            <Head title="Visa Requirements Result" />
            {isPreview ? (
                // The preview opens in a new tab, so there's no page history to return to —
                // a plain link back to the visa list stands in for the breadcrumb.
                <div className="mb-4">
                    <a href="/admin/visa-services" className="btn btn-outline-secondary btn-sm">
                        <i className="fa fa-arrow-left me-2"></i>Back
                    </a>
                </div>
            ) : (
                <div className="page-title mb-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li><h1>Visas</h1></li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard"><i className="fa fa-home me-2"></i>Dashboard</a>
                            </li>
                            <li className="breadcrumb-item"><a href="/admin/visa-search">Search</a></li>
                            <li className="breadcrumb-item active">Result</li>
                        </ol>
                    </nav>
                </div>
            )}
            <VisaResultView {...props} resultPath="/admin/visa-search/result" hideGetStarted={isPreview} />
        </ProtectedRoute>
    );
}
