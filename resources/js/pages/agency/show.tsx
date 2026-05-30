import MasterLayout from '@/layouts/backend/MasterLayout';
import { useState, useEffect } from 'react';
import AgencyOverview from './components/AgencyOverview';
import AgencyDocuments from './components/AgencyDocuments';
import AgencyService from './components/AgencyService';
import AgencyPermission from './components/AgencyPermission';
import AgencyBooking from './components/AgencyBooking';
import AgencyFund from './components/AgencyFund';

interface Agency {
    id: number;
    agency_name: string;
    legal_name: string;
    email: string;
    phone_number: string;
    alternate_phone?: string;
    website?: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    registration_number?: string;
    gst_number?: string;
    pan_number?: string;
    account_number?: string;
    ifsc_code?: string;
    note?: string;
    tax_status: number;
    created_at?: string;
}

interface Props {
    agency: Agency;
}

export default function AgencyShow({ agency }: Props) {
    // Get tab from URL parameter
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('tab') || 'overview';
        }
        return 'overview';
    });

    // Update URL when tab changes (without page reload)
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        const newUrl = `/agency/${agency.id}?tab=${tab}`;
        window.history.pushState({ tab }, '', newUrl);
    };

    // Load tab from URL when page loads
    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab') || 'overview';
            setActiveTab(tab);
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const avatarLetter = agency.agency_name ? agency.agency_name.charAt(0).toUpperCase() : 'A';

    return (
        <MasterLayout title="Agency Detail">
            {/* Page Title & Breadcrumb */}
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Agency Detail</h1></li>
                        <li className="breadcrumb-item">
                            <a href="/dashboard">
                                <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Home
                            </a>
                        </li>
                        <li className="breadcrumb-item"><a href="/agency">Agency</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Detail</li>
                    </ol>
                </nav>
            </div>

            {/* Profile Header Card */}
            <div className="card border-top-0 border-start-0 border-end-0 rounded-0 h-auto mb-4 px-md-2 pt-md-2">
                {/* Profile Header Section */}
                <div className="card-body d-flex py-md-4">
                    {/* Avatar Section */}
                    <div className="clearfix">
                        <div className="d-inline-block position-relative me-sm-4 me-3 mb-3 mb-lg-0">
                            <div className="avatar avatar-xxl bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                                <span className="text-primary fw-bold fs-32">{avatarLetter}</span>
                            </div>
                            <span className="fa fa-circle border border-3 border-white text-success position-absolute bottom-0 end-0 rounded-circle"></span>
                        </div>
                    </div>

                    {/* Agency Info Section */}
                    <div className="clearfix d-xl-flex flex-grow-1">
                        <div className="clearfix pe-md-5">
                            <h3 className="fw-semibold mb-1">{agency.agency_name}</h3>
                            <ul className="d-flex flex-wrap align-items-center mb-3">
                                <li className="me-3 d-inline-flex align-items-center">
                                    <i className="fa-solid fa-building me-2 text-primary"></i>
                                    <span>{agency.legal_name}</span>
                                </li>
                                <li className="me-3 d-inline-flex align-items-center">
                                    <i className="fa-solid fa-map-marker me-2 text-primary"></i>
                                    <span>{agency.city}, {agency.country}</span>
                                </li>
                                <li className="me-3 d-inline-flex align-items-center">
                                    <i className="fa-solid fa-envelope me-2 text-primary"></i>
                                    <a href={`mailto:${agency.email}`}>{agency.email}</a>
                                </li>
                            </ul>

                            {/* Stats Cards */}
                            <div className="d-md-flex d-none flex-wrap gap-3">
                                <div className="border outline-dashed rounded p-3 d-flex align-items-center">
                                    <div className="avatar avatar-sm avatar-primary">
                                        <i className="fa-solid fa-phone text-white"></i>
                                    </div>
                                    <div className="clearfix ms-2">
                                        <h6 className="mb-0 fw-semibold">{agency.phone_number}</h6>
                                        <span className="small">Phone</span>
                                    </div>
                                </div>

                                <div className="border outline-dashed rounded p-3 d-flex align-items-center">
                                    <div className="avatar avatar-sm avatar-primary">
                                        <i className="fa-solid fa-globe text-white"></i>
                                    </div>
                                    <div className="clearfix ms-2">
                                        <h6 className="mb-0 fw-semibold">{agency.state}</h6>
                                        <span className="small">State</span>
                                    </div>
                                </div>

                                <div className="border outline-dashed rounded p-3 d-flex align-items-center">
                                    <div className="avatar avatar-sm avatar-primary">
                                        <i className="fa-solid fa-flag text-white"></i>
                                    </div>
                                    <div className="clearfix ms-2">
                                        <h6 className="mb-0 fw-semibold">{agency.tax_status === 1 ? 'Active' : 'Inactive'}</h6>
                                        <span className="small">Status</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="clearfix mt-3 mt-xl-0 ms-auto d-flex flex-column col-xl-3 gap-2">
                            <a href={`/agency/${agency.id}/edit`} className="btn btn-primary">
                                <i className="fa-solid fa-pen me-2"></i>
                                Edit Agency
                            </a>
                            <a href="/agency" className="btn btn-light">
                                <i className="fa-solid fa-arrow-left me-2"></i>
                                Back to List
                            </a>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="card-footer py-0 d-flex flex-wrap justify-content-between align-items-center mx-sm-4 px-0">
                    <ul className="nav nav-underline gap-3 nav-scroll nav-scroll-auto-xl px-3 px-sm-0" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                onClick={() => handleTabChange('overview')}
                                className="nav-link py-3 px-3 border-bottom-3"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === 'overview' ? '3px solid #0d6efd' : '2px solid transparent',
                                    color: activeTab === 'overview' ? '#0d6efd' : '#6c757d',
                                    fontWeight: activeTab === 'overview' ? '600' : '500',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Overview
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                onClick={() => handleTabChange('service')}
                                className="nav-link py-3 px-3 border-bottom-3"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === 'service' ? '3px solid #0d6efd' : '2px solid transparent',
                                    color: activeTab === 'service' ? '#0d6efd' : '#6c757d',
                                    fontWeight: activeTab === 'service' ? '600' : '500',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Service
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                onClick={() => handleTabChange('permission')}
                                className="nav-link py-3 px-3 border-bottom-3"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === 'permission' ? '3px solid #0d6efd' : '2px solid transparent',
                                    color: activeTab === 'permission' ? '#0d6efd' : '#6c757d',
                                    fontWeight: activeTab === 'permission' ? '600' : '500',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Permission
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                onClick={() => handleTabChange('document')}
                                className="nav-link py-3 px-3 border-bottom-3"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === 'document' ? '3px solid #0d6efd' : '2px solid transparent',
                                    color: activeTab === 'document' ? '#0d6efd' : '#6c757d',
                                    fontWeight: activeTab === 'document' ? '600' : '500',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Document
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                onClick={() => handleTabChange('booking')}
                                className="nav-link py-3 px-3 border-bottom-3"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === 'booking' ? '3px solid #0d6efd' : '2px solid transparent',
                                    color: activeTab === 'booking' ? '#0d6efd' : '#6c757d',
                                    fontWeight: activeTab === 'booking' ? '600' : '500',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Booking
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                onClick={() => handleTabChange('fund')}
                                className="nav-link py-3 px-3 border-bottom-3"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === 'fund' ? '3px solid #0d6efd' : '2px solid transparent',
                                    color: activeTab === 'fund' ? '#0d6efd' : '#6c757d',
                                    fontWeight: activeTab === 'fund' ? '600' : '500',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Fund
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Content Section */}
            <div className="container-fluid p-0 mt-4">
                {activeTab === 'overview' && <AgencyOverview agency={agency} />}
                {activeTab === 'service' && <AgencyService agency={agency} />}
                {activeTab === 'permission' && <AgencyPermission agency={agency} />}
                {activeTab === 'document' && <AgencyDocuments agency={agency} />}
                {activeTab === 'booking' && <AgencyBooking agency={agency} />}
                {activeTab === 'fund' && <AgencyFund agency={agency} />}
            </div>
        </MasterLayout>
    );
}
