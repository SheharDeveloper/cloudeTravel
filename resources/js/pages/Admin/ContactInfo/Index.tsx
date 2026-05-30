import MasterLayout from '@/layouts/backend/MasterLayout';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { contactInfoService, ContactInfo } from '@/services/contactInfoService';
import toast, { Toaster } from 'react-hot-toast';
import ContactInfoForm from './Form';

export default function ContactInfoIndex() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [touchImageFile, setTouchImageFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [touchImagePreview, setTouchImagePreview] = useState<string>('');
    const [formData, setFormData] = useState<ContactInfo>({
        email: '',
        phone: '',
        location: '',
        address: '',
        about_text: '',
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        linkedin_url: '',
        logo: '',
        get_in_touch_image: '',
    });

    useEffect(() => {
        loadContactInfo();
    }, []);

    const loadContactInfo = async () => {
        try {
            const data = await contactInfoService.get();
            if (data) {
                setFormData(data);
            }
        } catch (err) {
            console.error('Error loading contact info:', err);
            toast.error('Failed to load contact information');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (fieldName: string, file: File) => {
        if (fieldName === 'logo') {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else if (fieldName === 'get_in_touch_image') {
            setTouchImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setTouchImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        try {
            let submitData: any = formData;

            if (logoFile || touchImageFile) {
                const formDataObj = new FormData();
                Object.keys(formData).forEach(key => {
                    if (key !== 'logo' && key !== 'get_in_touch_image') {
                        formDataObj.append(key, (formData as any)[key] || '');
                    }
                });
                if (logoFile) {
                    formDataObj.append('logo', logoFile);
                }
                if (touchImageFile) {
                    formDataObj.append('get_in_touch_image', touchImageFile);
                }
                submitData = formDataObj;
            }

            const result = await contactInfoService.update(submitData);
            if (result) {
                toast.success('Contact information updated successfully!');
                setFormData(result);
                setLogoFile(null);
                setTouchImageFile(null);
                setLogoPreview('');
                setTouchImagePreview('');
            } else {
                toast.error('Failed to update contact information');
            }
        } catch (err) {
            console.error('Error updating contact info:', err);
            toast.error('Error updating contact information');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ProtectedRoute>
               {/* Breadcrumb */}
                <div className="page-title">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li><h1>Contact Information</h1></li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Home
                                </a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Contact Information</li>
                        </ol>
                    </nav>
                </div>

                {/* Contact Info Form */}
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header border-0">
                                <h5 className="card-title mb-0">Edit Contact Information</h5>
                            </div>

                            <div className="card-body">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <ContactInfoForm
                                        data={formData}
                                        onChange={handleInputChange}
                                        onFileChange={handleFileChange}
                                        logoPreview={logoPreview}
                                        touchImagePreview={touchImagePreview}
                                        onSubmit={handleSubmit}
                                        isLoading={saving}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <Toaster position="top-right" />
            </ProtectedRoute>
    );
}
