import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import MasterLayout from '@/layouts/backend/MasterLayout';

export default function ProfileSettings() {
    const { auth, errors } = usePage().props as any;
    const user = auth?.user;

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [avatar, setAvatar] = useState(user?.profile_image_url);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors).join(', ');
            toast.error(errorMessages as string);
            setProfileLoading(false);
            setPasswordLoading(false);
        }
    }, [errors]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const getInputClass = (fieldName: string) => {
        const baseClass = 'form-control';
        return errors?.[fieldName] ? `${baseClass} is-invalid` : baseClass;
    };

    const getErrorMessage = (fieldName: string) => {
        return errors?.[fieldName] ? (
            <div className="invalid-feedback d-block" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors[fieldName]}
            </div>
        ) : null;
    };

    const isSuperAdmin = user?.type === 'super_admin';

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);

        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('email', formData.email);
        dataToSend.append('phone', formData.phone);

        if (avatarFile) {
            dataToSend.append('profile_pic', avatarFile);
        }

        router.post('/profile-upload', dataToSend, {
            onSuccess: () => {
                setProfileLoading(false);
                setAvatarFile(null);
                toast.success('Profile updated successfully!');
            },
            onError: (errors) => {
                console.error('Profile update failed:', errors);
                setProfileLoading(false);
                toast.error('Failed to update profile. Please try again.');
            },
        });
    };

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.password !== passwordData.password_confirmation) {
            toast.error('Passwords do not match');
            return;
        }

        setPasswordLoading(true);

        router.put('/password', passwordData, {
            onSuccess: () => {
                setPasswordData({ current_password: '', password: '', password_confirmation: '' });
                setPasswordLoading(false);
                toast.success('Password updated successfully!');
            },
            onError: (errors) => {
                console.error('Password update failed:', errors);
                setPasswordLoading(false);
                toast.error('Failed to update password. Please try again.');
            },
        });
    };

    return (
        <MasterLayout title="Profile Settings">
            <Head title="Profile Settings" />
            <Toaster position="top-right" />

            {/* Page Title */}
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Profile Settings</h1></li>
                        <li className="breadcrumb-item active">Manage your profile</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                {/* Avatar Section */}
                <div className="col-md-4 mb-4">
                    <div className="card">
                        <div className="card-body text-center py-4">
                            <div className="mb-3">
                                <img
                                    src={avatar}
                                    alt="Avatar"
                                    className="avatar avatar-xl rounded-circle border-3"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            </div>
                            <h6 className="mb-3">{user?.name}</h6>
                            <label className="btn btn-primary btn-sm">
                                <i className="fa fa-camera me-2"></i>Upload Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="col-md-8 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Basic Information</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={saveProfile}>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className={getInputClass('name')}
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {getErrorMessage('name')}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Email
                                        {!isSuperAdmin && <span style={{ color: '#6b7280', fontSize: '0.875rem', marginLeft: '0.5rem' }}>(Read-only)</span>}
                                    </label>
                                    <input
                                        type="email"
                                        className={getInputClass('email')}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!isSuperAdmin}
                                        required
                                    />
                                    {getErrorMessage('email')}
                                    {!isSuperAdmin && (
                                        <small style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                                            Only super administrators can change their email address.
                                        </small>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Phone (10 digits)</label>
                                    <input
                                        type="tel"
                                        className={getInputClass('phone')}
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter 10-digit phone number"
                                        maxLength={10}
                                    />
                                    {getErrorMessage('phone')}
                                    <small style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                                        Enter exactly 10 digits
                                    </small>
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                                    {profileLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change */}
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Change Password</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={updatePassword}>
                                <div className="mb-3">
                                    <label className="form-label">Current Password</label>
                                    <input
                                        type="password"
                                        className={getInputClass('current_password')}
                                        name="current_password"
                                        value={passwordData.current_password}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    {getErrorMessage('current_password')}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className={getInputClass('password')}
                                        name="password"
                                        value={passwordData.password}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    {getErrorMessage('password')}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        className={getInputClass('password_confirmation')}
                                        name="password_confirmation"
                                        value={passwordData.password_confirmation}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    {getErrorMessage('password_confirmation')}
                                </div>

                                <button type="submit" className="btn btn-danger" disabled={passwordLoading}>
                                    {passwordLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Notifications</h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" defaultChecked id="emailNotif" />
                                    <label className="form-check-label" htmlFor="emailNotif">
                                        Email Notifications
                                    </label>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" defaultChecked id="bookingNotif" />
                                    <label className="form-check-label" htmlFor="bookingNotif">
                                        Booking Updates
                                    </label>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="promotionNotif" />
                                    <label className="form-check-label" htmlFor="promotionNotif">
                                        Promotional Offers
                                    </label>
                                </div>
                            </div>

                            <div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" defaultChecked id="securityNotif" />
                                    <label className="form-check-label" htmlFor="securityNotif">
                                        Security Alerts
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
}
