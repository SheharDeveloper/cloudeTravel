import { useEffect, useRef, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';

interface Props {
    invoice: {
        uid: string;
        invoice_number: string;
        service_name: string;
        receiver: { name: string | null; cid: string | null } | null;
        total: string;
        status_label: string;
        confirmation_label: string;
        confirmed_via: 'esign' | 'paper' | null;
        invoice_url: string;
        booking_url: string;
    };
}

/** View: the invoice inside the admin (sidebar kept), with Back to the list and Print. */
export default function InvoiceShow() {
    const { invoice } = usePage().props as unknown as Props;
    const frame = useRef<HTMLIFrameElement>(null);
    const [loading, setLoading] = useState(true);
    // The invoice may finish loading before this page's scripts start (onLoad missed)
    useEffect(() => {
        if (frame.current?.contentDocument?.readyState === 'complete' && frame.current.contentDocument.body?.childElementCount) {
            setLoading(false);
        }
    }, []);

    // Back to where View was clicked (the list keeps its filters and page); opened directly → the list
    const back = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.visit('/admin/invoices');
        }
    };

    const print = () => frame.current?.contentWindow?.print();

    return (
        <ProtectedRoute>
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Invoice {invoice.invoice_number}</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/invoices">Invoices</a></li>
                        <li className="breadcrumb-item active">{invoice.invoice_number}</li>
                    </ol>
                </nav>
            </div>

            <div className="card h-auto mb-3">
                <div className="card-body py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={back}>
                            <i className="fa fa-arrow-left me-2"></i>Back
                        </button>
                        <div className="small">
                            <strong>{invoice.service_name}</strong>
                            {invoice.receiver?.name && <> · {invoice.receiver.name}{invoice.receiver.cid ? ` (${invoice.receiver.cid})` : ''}</>}
                            <> · {invoice.total}</>
                            <span className={`ms-2 ${invoice.confirmed_via ? 'text-success' : 'text-danger'}`}>{invoice.confirmation_label}</span>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <a href={invoice.booking_url} className="btn btn-outline-primary btn-sm">
                            <i className="fa fa-eye me-2"></i>Booking
                        </a>
                        <button type="button" className="btn btn-primary btn-sm" onClick={print} disabled={loading}>
                            <i className="fa fa-print me-2"></i>Print
                        </button>
                    </div>
                </div>
            </div>

            <div className="card h-auto">
                <div className="card-body p-0 position-relative">
                    {loading && (
                        <div className="position-absolute top-0 start-0 w-100 text-center py-5 text-muted">
                            <i className="fa fa-spinner fa-spin me-2"></i>Loading invoice…
                        </div>
                    )}
                    <iframe
                        ref={frame}
                        src={invoice.invoice_url}
                        title={`Invoice ${invoice.invoice_number}`}
                        onLoad={() => setLoading(false)}
                        style={{ width: '100%', height: '85vh', border: 0, borderRadius: 8, background: '#fff' }}
                    />
                </div>
            </div>
        </ProtectedRoute>
    );
}
