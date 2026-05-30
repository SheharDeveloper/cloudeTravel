import MasterLayout from '@/layouts/backend/MasterLayout';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { heroImageService } from '@/services/heroImageService';
import HeroImageForm from './Form';

export default function HeroImageIndex() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        image_url: '',
        title: '',
        subtitle: '',
        order: 1,
        status: 1,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        const data = await heroImageService.getAllForAdmin();
        setImages(data);
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        const newValue = type === 'number' || type === 'select-one' ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            let result: any = null;
            const submitData = imageFile ? createFormData() : formData;

            if (editingId) {
                result = await heroImageService.update(editingId, submitData);
                if (result) {
                    setImages(images.map(img => img.id === editingId ? result : img));
                    resetForm();
                }
            } else {
                result = await heroImageService.create(submitData);
                if (result) {
                    setImages([...images, result]);
                    resetForm();
                }
            }

            if (!result) {
                alert('Failed to save hero image');
            }
        } catch (err) {
            console.error('Error saving hero image:', err);
            alert('Error saving hero image');
        }
    };

    const createFormData = () => {
        const data = new FormData();
        if (imageFile) data.append('image_url', imageFile);
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('order', formData.order.toString());
        data.append('status', formData.status.toString());
        return data;
    };

    const handleEdit = (image: any) => {
        setFormData({
            image_url: image.image_url,
            title: image.title,
            subtitle: image.subtitle,
            order: image.order || 1,
            status: image.status || 1,
        });
        setImagePreview(image.image_url);
        setImageFile(null);
        setEditingId(image.id);
        setShowForm(true);
    };

    const handleStatusToggle = async (id: number, currentStatus: number) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            const result = await heroImageService.update(id, { status: newStatus });
            if (result) {
                setImages(images.map(img => img.id === id ? { ...img, status: newStatus } : img));
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
            const success = await heroImageService.delete(deleteConfirm);
            if (success) {
                setImages(images.filter(img => img.id !== deleteConfirm));
                setDeleteConfirm(null);
            } else {
                alert('Failed to delete hero image');
            }
        } catch (err) {
            console.error('Error deleting hero image:', err);
            alert('Error deleting hero image');
        } finally {
            setDeleting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            image_url: '',
            title: '',
            subtitle: '',
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
                            <li><h1>Hero Images</h1></li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Home
                                </a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Hero Images</li>
                        </ol>
                    </nav>
                </div>

                {/* Hero Images List */}
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header border-0 d-flex align-items-center justify-content-between">
                                <h5 className="card-title mb-0">Hero Images</h5>
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="btn btn-primary btn-sm"
                                >
                                    {showForm ? (
                                        <i className="fa-solid fa-times"></i>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-plus me-1"></i> Add Image
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Form Section */}
                            {showForm && (
                                <div className="card-body border-bottom">
                                    <HeroImageForm
                                        data={formData}
                                        onChange={handleInputChange}
                                        onFileChange={handleImageFileChange}
                                        onSubmit={handleSubmit}
                                        isLoading={false}
                                        editingId={editingId}
                                        preview={imagePreview}
                                    />
                                </div>
                            )}

                            {/* Images List */}
                            {!showForm && (
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="p-4 text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : images.length === 0 ? (
                                    <div className="p-4 text-center text-muted">
                                        <p className="mb-0">No hero images found. <button onClick={() => setShowForm(true)} className="btn btn-link p-0">Create one</button></p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="ps-3">#</th>
                                                    <th>Image</th>
                                                    <th>Title</th>
                                                    <th>Subtitle</th>
                                                    <th>Order</th>
                                                    <th>Status</th>
                                                    <th className="text-end pe-3">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {images.map((image, i) => (
                                                    <tr key={image.id}>
                                                        <td className="ps-3">{i + 1}</td>
                                                        <td>
                                                            <img src={image.image_url} alt={image.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                                        </td>
                                                        <td>{image.title}</td>
                                                        <td>{image.subtitle}</td>
                                                        <td>{image.order}</td>
                                                        <td>
                                                            <div
                                                                onClick={() => handleStatusToggle(image.id, image.status)}
                                                                style={{
                                                                    display: 'inline-flex',
                                                                    width: '50px',
                                                                    height: '28px',
                                                                    backgroundColor: image.status === 1 ? '#28a745' : '#6c757d',
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
                                                                        transform: image.status === 1 ? 'translateX(22px)' : 'translateX(0)',
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="text-end pe-3">
                                                            <div className="d-flex gap-2 justify-content-end">
                                                                <button
                                                                    onClick={() => handleEdit(image)}
                                                                    className="btn btn-warning btn-xs light"
                                                                    title="Edit"
                                                                >
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteClick(image.id)}
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
                    title="Delete Hero Image"
                    message="Are you sure you want to delete this hero image? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    isLoading={deleting}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteConfirm(null)}
                />
           </ProtectedRoute>
    );
}
