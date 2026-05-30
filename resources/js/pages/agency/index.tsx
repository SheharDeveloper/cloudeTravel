import MasterLayout from '@/layouts/backend/MasterLayout';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function AgencyIndex() {
    // State management
    const [agencies, setAgencies] = useState<any[]>([]); // List of agencies
    const [loading, setLoading] = useState(true); // Loading state while fetching
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
    }); // Statistics (total and active count)
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null); // Agency ID pending deletion
    const [deleting, setDeleting] = useState(false); // Loading state while deleting

    /**
     * Fetch all agencies from API on component mount
     * Updates agencies list and calculates statistics
     */
    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                console.log('=== FETCHING AGENCIES ===');
                const response = await apiFetch('/api/agencies', {
                    method: 'GET',
                });

                console.log('Response Status:', response.status);
                console.log('Response Headers:', {
                    contentType: response.headers.get('content-type'),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ API Response Data:', data);

                    // Handle different response structures
                    let agenciesList = [];
                    if (Array.isArray(data)) {
                        agenciesList = data;
                    } else if (data.data && Array.isArray(data.data)) {
                        agenciesList = data.data;
                    } else if (data.data && typeof data.data === 'object') {
                        // Handle paginated response
                        agenciesList = data.data.data || [];
                    }

                    console.log('Agencies List:', agenciesList);
                    setAgencies(agenciesList);
                    setStats({
                        total: agenciesList.length,
                        active: agenciesList.filter((a: any) => a.tax_status === 1).length,
                    });
                } else {
                    const errorText = await response.text();
                    console.error('❌ API Error Response:', response.status, errorText.substring(0, 200));
                    setAgencies([]);
                }
            } catch (err) {
                console.error('❌ Failed to fetch agencies:', err);
                setAgencies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAgencies();
    }, []);

    /**
     * Show delete confirmation modal for a specific agency
     * Stores the agency ID that user wants to delete
     */
    const handleDeleteClick = (id: number) => {
        setDeleteConfirm(id);
    };

    /**
     * Confirm and execute agency deletion
     * Sends DELETE request to /api/agencies/{id}
     * Updates the agencies list and statistics on success
     */
    const handleConfirmDelete = async () => {
        if (deleteConfirm === null) return;

        setDeleting(true);
        try {
            const response = await apiFetch(`/api/agencies/${deleteConfirm}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('✅ Agency deleted successfully');
                setAgencies(agencies.filter((a) => a.id !== deleteConfirm));
                setStats({
                    total: stats.total - 1,
                    active: stats.active - (agencies.find((a) => a.id === deleteConfirm)?.tax_status === 1 ? 1 : 0),
                });
                setDeleteConfirm(null);
            } else {
                console.error('❌ Failed to delete agency');
            }
        } catch (err) {
            console.error('❌ Error deleting agency:', err);
        } finally {
            setDeleting(false);
        }
    };

    /**
     * Cancel delete operation and close confirmation modal
     * Clears the pending delete agency ID
     */
    const handleCancelDelete = () => {
        setDeleteConfirm(null);
    };

    const statsDisplay = [
        { label: 'Total Agencies', value: String(stats.total || 0), icon: 'fa-solid fa-building', color: 'primary' },
        { label: 'Active', value: String(stats.active || 0), icon: 'fa-solid fa-circle-check', color: 'success' },
    ];

    return (
        <ProtectedRoute>
            <MasterLayout title="Agency">

            {/* Breadcrumb */}
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Agency</h1></li>
                        <li className="breadcrumb-item">
                            <a href="/dashboard">
                                <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Home
                            </a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Agency</li>
                    </ol>
                </nav>
            </div>

            {/* Stats */}
            <div className="row">
                {statsDisplay.map((s) => (
                    <div key={s.label} className="col-xl-3 col-sm-6">
                        <div className="card">
                            <div className="card-body d-flex align-items-center">
                                <div className={`avatar avatar-md bg-${s.color} bg-opacity-10 rounded-circle me-3`}>
                                    <i className={`${s.icon} text-${s.color}`}></i>
                                </div>
                                <div>
                                    <h3 className="mb-0">{s.value}</h3>
                                    <span className="text-muted fs-13">{s.label}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Agency List */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header border-0 d-flex align-items-center justify-content-between">
                            <h5 className="card-title mb-0">Agency List</h5>
                            <a href="/agency/create" className="btn btn-primary btn-sm">
                                <i className="fa-solid fa-plus me-1"></i> Add Agency
                            </a>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="p-4 text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : agencies.length === 0 ? (
                                <div className="p-4 text-center text-muted">
                                    <p className="mb-0">No agencies found. <a href="/agency/create">Create one</a></p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3">#</th>
                                                <th>Agency</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Location</th>
                                                <th className="text-end pe-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {agencies.map((a, i) => (
                                            <tr key={a.id}>
                                                <td className="ps-3">{i + 1}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar avatar-md rounded-circle bg-primary bg-opacity-10 me-3">
                                                            <span className="text-primary fw-bold">
                                                                {a.agency_name?.charAt(0) || 'A'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-0">{a.agency_name}</h6>
                                                            <small className="text-muted">{a.email}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {a.email}
                                                </td>
                                                <td>
                                                    {a.phone_number}
                                                </td>
                                                <td>
                                                    <span className="d-block">{a.city}</span>
                                                    <small className="text-muted">{a.country}</small>
                                                </td>
                                                <td className="text-end pe-3">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <a href={`/agency/${a.id}`} className="btn btn-primary btn-xs light" title="View">
                                                            <i className="fa-solid fa-eye"></i>
                                                        </a>
                                                        <a href={`/agency/${a.id}/edit`} className="btn btn-warning btn-xs light" title="Edit">
                                                            <i className="fa-solid fa-pen"></i>
                                                        </a>
                                                        <button
                                                            className="btn btn-danger btn-xs light"
                                                            onClick={() => handleDeleteClick(a.id)}
                                                            disabled={deleting}
                                                            title="Delete"
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                show={deleteConfirm !== null}
                title="Delete Agency"
                message="Are you sure you want to delete this agency? This action cannot be undone."
                confirmText="Delete Agency"
                cancelText="Cancel"
                isLoading={deleting}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                />
            </MasterLayout>
        </ProtectedRoute>
    );
}
