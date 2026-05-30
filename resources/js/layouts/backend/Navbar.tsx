import { clearAuthToken, apiFetch } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiFetch('/api/user', {
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                }
            } catch (err) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            }
        };

        fetchUser();
    }, []);

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
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                },
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
                    <img src="/images/logo.png" alt="Logo" style={{ height: '45px', width: 'auto', objectFit: 'contain' }} />
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

            {/* Top Header bar */}
            <div className="header">
                <div className="header-content">
                    <nav className="navbar navbar-expand">
                        <div className="collapse navbar-collapse justify-content-between">

                            {/* Search */}
                            <div className="header-left">
                                <form>
                                    <div className="header-search position-relative">
                                        <input type="text" className="form-control" placeholder="Search" />
                                        <span className="input-group-text position-absolute end-0 top-0">
                                            <button className="bg-transparent border-0" type="button" aria-label="Search">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.3" d="M14.2929 16.7071C13.9024 16.3166 13.9024 15.6834 14.2929 15.2929C14.6834 14.9024 15.3166 14.9024 15.7071 15.2929L19.7071 19.2929C20.0976 19.6834 20.0976 20.3166 19.7071 20.7071C19.3166 21.0976 18.6834 21.0976 18.2929 20.7071L14.2929 16.7071Z" fill="#452B90" />
                                                    <path d="M11 16C13.7614 16 16 13.7614 16 11C16 8.23859 13.7614 6 11 6C8.23858 6 6 8.23859 6 11C6 13.7614 8.23858 16 11 16ZM11 18C7.13401 18 4 14.866 4 11C4 7.13402 7.13401 4 11 4C14.866 4 18 7.13402 18 11C18 14.866 14.866 18 11 18Z" fill="#452B90" />
                                                </svg>
                                            </button>
                                        </span>
                                    </div>
                                </form>
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
                                                    <img src="/backend/assets/images/user_3.jpg" alt="Profile" />
                                                </div>
                                            </div>
                                        </button>
                                        {dropdownOpen && (
                                            <div className="dropdown-menu dropdown-menu-end py-0 show" style={{ position: 'absolute', top: '100%', right: 0, minWidth: '250px', zIndex: 9999 }}>
                                                <div className="py-2 d-flex px-3 align-items-center" style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <img src="/backend/assets/images/tab/1_3.jpg" className="avatar avatar-sm rounded-circle" alt="" />
                                                    <div className="ms-2" style={{ flex: 1, minWidth: 0 }}>
                                                        <h6 className="mb-0" style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || user?.email || 'User'}</h6>
                                                        <small style={{ fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.role || 'Admin'}</small>
                                                    </div>
                                                </div>
                                                <a className="dropdown-item" href="/profile" onClick={() => setDropdownOpen(false)} style={{ padding: '0.75rem 1rem', cursor: 'pointer' }}>
                                                    Profile
                                                </a>
                                                <a className="dropdown-item" href="/settings" onClick={() => setDropdownOpen(false)} style={{ padding: '0.75rem 1rem', cursor: 'pointer' }}>
                                                    Settings
                                                </a>
                                                <hr className="dropdown-divider mb-0" style={{ margin: '0.5rem 0' }} />
                                                <a href="#" className="dropdown-item text-danger" onClick={(e) => { e.preventDefault(); handleLogout(e); setDropdownOpen(false); }} style={{ padding: '0.75rem 1rem', cursor: 'pointer', color: '#dc2626' }}>
                                                    Logout
                                                </a>
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
