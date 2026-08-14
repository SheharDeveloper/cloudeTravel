import { clearAuthToken } from '@/lib/api';
import { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { auth, name, authAgency, impersonating } = usePage().props as any;
    const user = auth?.user;
    const companyName = authAgency?.agency_name || (name as string) || 'CloudTravel';
    const [stopping, setStopping] = useState(false);

    const stopImpersonating = () => {
        setStopping(true);
        router.post('/admin/staff-stop-impersonating', {}, {
            onFinish: () => setStopping(false),
        });
    };
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [dropdownOpen]);

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'include',
            });

            if (response.ok) {
                clearAuthToken();
                window.location.href = '/login';
            }
        } catch (err) {
            console.error('Logout failed:', err);
            clearAuthToken();
            window.location.href = '/login';
        }
    };

    return (
        <>
            {/* Nav Header (logo + hamburger) */}
            <div className="nav-header">
                <a href="/dashboard" className="brand-logo">
                    <img src={authAgency?.logo || '/images/logo.png'} alt={companyName} style={{ height: '45px', width: 'auto', objectFit: 'contain' }} />
                </a>
                <div className="nav-control">
                    <div className="hamburger">
                        <span className="line">
                            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.7468 5.58925C11.0722 5.26381 11.0722 4.73617 10.7468 4.41073C10.4213 4.0853 9.89369 4.0853 9.56826 4.41073L4.56826 9.41073C4.25277 9.72622 4.24174 10.2342 4.54322 10.5631L9.12655 15.5631C9.43754 15.9024 9.96468 15.9253 10.3039 15.6143C10.6432 15.3033 10.6661 14.7762 10.3551 14.4369L6.31096 10.0251L10.7468 5.58925Z" fill="#452B90" />
                                <path opacity="0.3" d="M16.5801 5.58924C16.9056 5.26381 16.9056 4.73617 16.5801 4.41073C16.2547 4.0853 15.727 4.0853 15.4016 4.41073L10.4016 9.41073C10.0861 9.72622 10.0751 10.2342 10.3766 10.5631L14.9599 15.5631C15.2709 15.9024 15.798 15.9253 16.1373 15.6143C16.4766 15.3033 16.4995 14.7762 16.1885 14.4369L12.1443 10.0251L16.5801 5.58924Z" fill="#452B90" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            {/* Impersonation banner */}
            {impersonating && (
                <div
                    className="d-flex align-items-center justify-content-center gap-3 text-white py-2 px-3"
                    style={{ backgroundColor: '#212529', fontSize: '0.875rem' }}
                >
                    <i className="fa fa-user-secret"></i>
                    <span>
                        Viewing as <strong>{impersonating.currentName}</strong> &mdash; signed in as <strong>{impersonating.name}</strong>
                    </span>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        onClick={stopImpersonating}
                        disabled={stopping}
                    >
                        {stopping ? 'Returning...' : 'Return to my account'}
                    </button>
                </div>
            )}

            {/* Top Header bar */}
            <div className="header">
                <div className="header-content">
                    <nav className="navbar navbar-expand">
                        <div className="collapse navbar-collapse justify-content-between">

                            {/* Company Info */}
                            <div className="header-left d-flex align-items-center">
                                <h5 className="mb-0 text-primary fw-bold">{companyName}</h5>
                            </div>

                            {/* Right side icons */}
                            <ul className="navbar-nav header-right align-items-center">

                                {/* Notification */}
                                <li className="nav-item dropdown notification_dropdown">
                                    <div className="dropdown">
                                        <button
                                            className="nav-link bg-white rounded-3 mx-1"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            aria-label="Notifications"
                                        >
                                            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M17.5 12H19C19.8284 12 20.5 12.6716 20.5 13.5C20.5 14.3284 19.8284 15 19 15H6C5.17157 15 4.5 14.3284 4.5 13.5C4.5 12.6716 5.17157 12 6 12H7.5L8.05827 6.97553C8.30975 4.71226 10.2228 3 12.5 3C14.7772 3 16.6903 4.71226 16.9417 6.97553L17.5 12Z" fill="#222B40" />
                                                <path opacity="0.3" d="M14.5 18C14.5 16.8954 13.6046 16 12.5 16C11.3954 16 10.5 16.8954 10.5 18C10.5 19.1046 11.3954 20 12.5 20C13.6046 20 14.5 19.1046 14.5 18Z" fill="#222B40" />
                                            </svg>
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-end py-0">
                                            <div className="dz-scroll p-2" style={{ height: '380px' }}>
                                                <div className="d-flex align-items-center p-2 bg-action-light rounded mb-2">
                                                    <div className="avatar avatar-sm avatar-success rounded-circle">KG</div>
                                                    <div className="clearfix ms-2">
                                                        <h6 className="fs-13 mb-0 fw-semibold">Report created successfully</h6>
                                                        <small>29 July 2020 - 02:26 PM</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <a className="d-block text-center p-3 border-top" href="#">
                                                See all notifications <i className="fa fa-arrow-right"></i>
                                            </a>
                                        </div>
                                    </div>
                                </li>

                                {/* Profile */}
                                <li className="nav-item dropdown header-profile-dropdown" ref={dropdownRef} style={{ position: 'relative' }}>
                                    <div className="dropdown" style={{ position: 'relative' }}>
                                        <button
                                            className="nav-link bg-white rounded-3 mx-1 ps-0"
                                            type="button"
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            aria-expanded={dropdownOpen}
                                            aria-label="Profile"
                                        >
                                            <div className="profile-head">
                                                <div className="avatar avatar-sm border-0">
                                                    <img src={user?.profile_image_url} alt="Profile" />
                                                </div>
                                            </div>
                                        </button>
                                        {dropdownOpen && (
                                            <div className="dropdown-menu dropdown-menu-end py-0 show" style={{ position: 'absolute', top: '100%', right: 0, minWidth: '250px', zIndex: 9999 }}>
                                                <div className="py-2 d-flex px-3 align-items-center" style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <img src={user?.profile_image_url} className="avatar avatar-sm rounded-circle" alt="" />
                                                    <div className="ms-2" style={{ flex: 1, minWidth: 0 }}>
                                                        <h6 className="mb-0" style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || user?.email || 'User'}</h6>
                                                        <small style={{ fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.role || 'Admin'}</small>
                                                    </div>
                                                </div>
                                                <a className="dropdown-item" href="/profile" onClick={() => setDropdownOpen(false)} style={{ padding: '0.75rem 1rem', cursor: 'pointer' }}>
                                                    <i className="fa fa-user me-2"></i>Profile
                                                </a>
                                                <hr className="dropdown-divider mb-0" style={{ margin: '0.5rem 0' }} />
                                                {impersonating ? (
                                                    <a
                                                        href="#"
                                                        className="dropdown-item text-danger"
                                                        onClick={(e) => { e.preventDefault(); setDropdownOpen(false); stopImpersonating(); }}
                                                        style={{ padding: '0.75rem 1rem', cursor: 'pointer', color: '#dc2626' }}
                                                    >
                                                        <i className="fa fa-user-secret me-2"></i>Leave Impersonation
                                                    </a>
                                                ) : (
                                                    <a href="#" className="dropdown-item text-danger" onClick={(e) => { e.preventDefault(); handleLogout(e); setDropdownOpen(false); }} style={{ padding: '0.75rem 1rem', cursor: 'pointer', color: '#dc2626' }}>
                                                        Logout
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </li>

                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}
