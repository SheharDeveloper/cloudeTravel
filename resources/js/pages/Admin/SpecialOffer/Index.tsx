import MasterLayout from '@/layouts/backend/MasterLayout';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { specialOfferService, SpecialOffer } from '@/services/specialOfferService';
import SpecialOfferForm from './Form';

export default function SpecialOfferIndex() {
    const [offers, setOffers] = useState<SpecialOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        airline: 'ETIHAD AIRWAYS',
        from: 'LONDON',
        destinations: 'destinations worldwide',
        price: '£495.00',
        description: 'Special fares with airlines',
    });

    useEffect(() => {
        loadOffers();
    }, []);

    const loadOffers = async () => {
        const data = await specialOfferService.getAll();
        setOffers(data);
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            let result: SpecialOffer | null = null;
            if (editingId) {
                result = await specialOfferService.update(editingId, formData);
                if (result) {
                    const updated = result;
                    setOffers(offers.map(o => o.id === editingId ? updated : o));
                    resetForm();
                }
            } else {
                result = await specialOfferService.create(formData);
                if (result) {
                    setOffers([...offers, result]);
                    resetForm();
                }
            }

            if (!result) {
                alert('Failed to save special offer');
            }
        } catch (err) {
            console.error('Error saving special offer:', err);
            alert('Error saving special offer');
        }
    };

    const handleEdit = (offer: SpecialOffer) => {
        setFormData({
            airline: offer.airline,
            from: offer.from,
            destinations: offer.destinations,
            price: offer.price,
            description: offer.description || '',
        });
        setEditingId(offer.id);
        setShowForm(true);
    };

    const handleDeleteClick = (id: number) => {
        setDeleteConfirm(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirm === null) return;

        setDeleting(true);
        try {
            const success = await specialOfferService.delete(deleteConfirm);
            if (success) {
                setOffers(offers.filter(o => o.id !== deleteConfirm));
                setDeleteConfirm(null);
            } else {
                alert('Failed to delete special offer');
            }
        } catch (err) {
            console.error('Error deleting special offer:', err);
            alert('Error deleting special offer');
        } finally {
            setDeleting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            airline: 'ETIHAD AIRWAYS',
            from: 'LONDON',
            destinations: 'destinations worldwide',
            price: '£495.00',
            description: 'Special fares with airlines',
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <ProtectedRoute>
                {/* Breadcrumb */}
                <div className="page-title">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li><h1>Special Offer</h1></li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Home
                                </a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Special Offer</li>
                        </ol>
                    </nav>
                </div>

                {/* Special Offer List */}
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header border-0 d-flex align-items-center justify-content-between">
                                <h5 className="card-title mb-0">Special Offers</h5>
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="btn btn-primary btn-sm"
                                >
                                    {showForm ? (
                                        <i className="fa-solid fa-times"></i>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-plus me-1"></i> Add Offer
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Form Section */}
                            {showForm && (
                                <div className="card-body border-bottom">
                                    <SpecialOfferForm
                                        data={formData}
                                        onChange={handleInputChange}
                                        onSubmit={handleSubmit}
                                        isLoading={false}
                                        editingId={editingId}
                                    />
                                </div>
                            )}

                            {/* Offers List */}
                            {!showForm && (
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="p-4 text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : offers.length === 0 ? (
                                    <div className="p-4 text-center text-muted">
                                        <p className="mb-0">No special offers found. <button onClick={() => setShowForm(true)} className="btn btn-link p-0">Create one</button></p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="ps-3">#</th>
                                                    <th>Airline</th>
                                                    <th>From</th>
                                                    <th>Destinations</th>
                                                    <th>Price</th>
                                                    <th className="text-end pe-3">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {offers.map((offer, i) => (
                                                    <tr key={offer.id}>
                                                        <td className="ps-3">{i + 1}</td>
                                                        <td>{offer.airline}</td>
                                                        <td>{offer.from}</td>
                                                        <td>{offer.destinations}</td>
                                                        <td>{offer.price}</td>
                                                        <td className="text-end pe-3">
                                                            <div className="d-flex gap-2 justify-content-end">
                                                                <button
                                                                    onClick={() => handleEdit(offer)}
                                                                    className="btn btn-warning btn-xs light"
                                                                    title="Edit"
                                                                >
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteClick(offer.id)}
                                                                    disabled={deleting}
                                                                    className="btn btn-danger btn-xs light"
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
                            )}
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <DeleteConfirmModal
                    show={deleteConfirm !== null}
                    title="Delete Special Offer"
                    message="Are you sure you want to delete this special offer? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    isLoading={deleting}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteConfirm(null)}
                />
        </ProtectedRoute>
    );
}
