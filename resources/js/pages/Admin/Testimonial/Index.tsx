import MasterLayout from '@/layouts/backend/MasterLayout';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { testimonialService } from '@/services/testimonialService';
import TestimonialForm from './Form';

export default function TestimonialIndex() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        client_name: '',
        client_image: '',
        message: '',
        rating: 5,
        order: 1,
        status: 1,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        const data = await testimonialService.getAllForAdmin();
        setTestimonials(data);
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        const newValue = type === 'number' || type === 'select-one' ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleRatingChange = (rating: number) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const handleImageFileChange = (file: File | null) => {
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview('');
        }
    };

    const createFormData = () => {
        const data = new FormData();
        if (imageFile) data.append('client_image', imageFile);
        data.append('client_name', formData.client_name);
        data.append('message', formData.message);
        data.append('rating', formData.rating.toString());
        data.append('order', formData.order.toString());
        data.append('status', formData.status.toString());
        return data;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            let result: any = null;
            const submitData = imageFile ? createFormData() : formData;

            if (editingId) {
                result = await testimonialService.update(editingId, submitData);
                if (result) {
                    setTestimonials(testimonials.map(t => t.id === editingId ? result : t));
                    resetForm();
                }
            } else {
                result = await testimonialService.create(submitData);
                if (result) {
                    setTestimonials([...testimonials, result]);
                    resetForm();
                }
            }

            if (!result) {
                alert('Failed to save testimonial');
            }
        } catch (err) {
            console.error('Error saving testimonial:', err);
            alert('Error saving testimonial');
        }
    };

    const handleEdit = (testimonial: any) => {
        setFormData({
            client_name: testimonial.client_name,
            client_image: testimonial.client_image,
            message: testimonial.message,
            rating: testimonial.rating || 5,
            order: testimonial.order || 1,
            status: testimonial.status || 1,
        });
        setImagePreview(testimonial.client_image);
        setImageFile(null);
        setEditingId(testimonial.id);
        setShowForm(true);
    };

    const handleStatusToggle = async (id: number, currentStatus: number) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            const result = await testimonialService.update(id, { status: newStatus });
            if (result) {
                setTestimonials(testimonials.map(t => t.id === id ? { ...t, status: newStatus } : t));
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error('Error toggling status:', err);
            alert('Error toggling status');
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteConfirm(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirm === null) return;

        setDeleting(true);
        try {
            const success = await testimonialService.delete(deleteConfirm);
            if (success) {
                setTestimonials(testimonials.filter(t => t.id !== deleteConfirm));
                setDeleteConfirm(null);
            } else {
                alert('Failed to delete testimonial');
            }
        } catch (err) {
            console.error('Error deleting testimonial:', err);
            alert('Error deleting testimonial');
        } finally {
            setDeleting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            client_name: '',
            client_image: '',
            message: '',
            rating: 5,
            order: 1,
            status: 1,
        });
        setImageFile(null);
        setImagePreview('');
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <ProtectedRoute>
                {/* Breadcrumb */}
                <div className="page-title">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li><h1>Testimonials</h1></li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Home
                                </a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Testimonials</li>
                        </ol>
                    </nav>
                </div>

                {/* Testimonials List */}
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header border-0 d-flex align-items-center justify-content-between">
                                <h5 className="card-title mb-0">Testimonials</h5>
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="btn btn-primary btn-sm"
                                >
                                    {showForm ? (
                                        <i className="fa-solid fa-times"></i>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-plus me-1"></i> Add Testimonial
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Form Section */}
                            {showForm && (
                                <div className="card-body border-bottom">
                                    <TestimonialForm
                                        data={formData}
                                        onChange={handleInputChange}
                                        onFileChange={handleImageFileChange}
                                        onRatingChange={handleRatingChange}
                                        onSubmit={handleSubmit}
                                        isLoading={false}
                                        editingId={editingId}
                                        preview={imagePreview}
                                    />
                                </div>
                            )}

                            {/* Testimonials List */}
                            {!showForm && (
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="p-4 text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : testimonials.length === 0 ? (
                                    <div className="p-4 text-center text-muted">
                                        <p className="mb-0">No testimonials found. <button onClick={() => setShowForm(true)} className="btn btn-link p-0">Create one</button></p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="ps-3">#</th>
                                                    <th>Image</th>
                                                    <th>Client Name</th>
                                                    <th>Message</th>
                                                    <th>Rating</th>
                                                    <th>Order</th>
                                                    <th>Status</th>
                                                    <th className="text-end pe-3">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {testimonials.map((testimonial, i) => (
                                                    <tr key={testimonial.id}>
                                                        <td className="ps-3">{i + 1}</td>
                                                        <td>
                                                            <img src={testimonial.client_image} alt={testimonial.client_name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                                        </td>
                                                        <td>{testimonial.client_name}</td>
                                                        <td>{testimonial.message.substring(0, 50)}...</td>
                                                        <td>
                                                            <span style={{ color: '#ff6b35' }}>
                                                                {'★'.repeat(testimonial.rating)}
                                                            </span>
                                                        </td>
                                                        <td>{testimonial.order}</td>
                                                        <td>
                                                            <div
                                                                onClick={() => handleStatusToggle(testimonial.id, testimonial.status)}
                                                                style={{
                                                                    display: 'inline-flex',
                                                                    width: '50px',
                                                                    height: '28px',
                                                                    backgroundColor: testimonial.status === 1 ? '#28a745' : '#6c757d',
                                                                    borderRadius: '14px',
                                                                    padding: '2px',
                                                                    cursor: 'pointer',
                                                                    transition: 'background-color 0.3s',
                                                                    alignItems: 'center',
                                                                    position: 'relative'
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: '24px',
                                                                        height: '24px',
                                                                        backgroundColor: 'white',
                                                                        borderRadius: '50%',
                                                                        transition: 'transform 0.3s',
                                                                        transform: testimonial.status === 1 ? 'translateX(22px)' : 'translateX(0)',
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="text-end pe-3">
                                                            <div className="d-flex gap-2 justify-content-end">
                                                                <button
                                                                    onClick={() => handleEdit(testimonial)}
                                                                    className="btn btn-warning btn-xs light"
                                                                    title="Edit"
                                                                >
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteClick(testimonial.id)}
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
                    title="Delete Testimonial"
                    message="Are you sure you want to delete this testimonial? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    isLoading={deleting}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteConfirm(null)}
                />
        </ProtectedRoute>
    );
}
