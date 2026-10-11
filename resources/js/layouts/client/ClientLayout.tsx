import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';

export interface PortalInfo {
    agencyName: string | null;
    logo: string | null;
    clientName: string | null;
    clientEmail: string | null;
}

const MENU = [
    { href: '/client/profile', label: 'My Profile', icon: 'fa fa-user' },
    { href: '/client/bookings', label: 'My Bookings', icon: 'fa fa-suitcase-rolling' },
    { href: '/client/invoices', label: 'Invoices', icon: 'fa fa-file-invoice' },
];

// Below this width the sidebar slides over the page (hidden until the menu button)
const OVERLAY_BELOW = 1024;

// The dashboard theme reads these attributes from <body>
function applyBodyAttrs() {
    const small = window.innerWidth < OVERLAY_BELOW;
    const attrs: Record<string, string> = {
        'data-theme-version': 'light',
        'data-bs-theme': 'light',
        'data-typography': 'poppins',
        'data-layout': 'vertical',
        'data-nav-headerbg': 'color_2',
        'data-headerbg': 'color_1',
        'data-sidebarbg': 'color_2',
        'data-sidebar-style': small ? 'overlay' : 'full',
        'data-sidebar-position': 'fixed',
        'data-header-position': 'fixed',
        'data-container': 'wide',
        'data-primary': 'color_3',
        direction: 'ltr',
    };
    Object.entries(attrs).forEach(([k, v]) => document.body.setAttribute(k, v));
}

/**
 * The signed-in client's pages: the agency dashboard's look (sidebar, top
 * bar), with the agency's logo and name, and the client's own menu.
 */
export default function ClientLayout({ title, children }: { title: string; children: React.ReactNode }) {
    const { portal } = usePage().props as unknown as { portal: PortalInfo };
    const url = usePage().url;
    // The hamburger folds the sidebar (the theme's "menu-toggle")
    const [folded, setFolded] = useState(false);

    useEffect(() => {
        applyBodyAttrs();
        window.addEventListener('resize', applyBodyAttrs);
        return () => window.removeEventListener('resize', applyBodyAttrs);
    }, []);

    const logout = () => router.post('/client/logout');

    return (
        <>
            <Head title={title}>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                <link rel="stylesheet" href="/backend/assets/css/plugins_4.css" />
                <link rel="stylesheet" href="/backend/assets/css/style_4.css" />
            </Head>
            <style>{`
                .client-active { color: #ffc107 !important; font-weight: 600 !important; }
                .client-user { display: flex; align-items: center; gap: 10px; }
                .client-user .avatar-initial { width: 38px; height: 38px; border-radius: 50%; background: var(--primary, #452B90); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; }
                @media (max-width: 575px) { .client-user .client-user-text { display: none; } }
            `}</style>

            <div id="main-wrapper" className={`show ${folded ? 'menu-toggle' : ''}`}>
                {/* Logo + hamburger */}
                <div className="nav-header">
                    <a href="/client/profile" className="brand-logo">
                        <img src={portal.logo || '/images/logo.png'} alt={portal.agencyName ?? ''} style={{ height: 45, width: 'auto', maxWidth: 150, objectFit: 'contain' }} />
                    </a>
                    <div className="nav-control" onClick={() => setFolded((f) => !f)} role="button" aria-label="Toggle menu">
                        <div className={`hamburger ${folded ? 'is-active' : ''}`}>
                            <span className="line"><i className="fa fa-bars" style={{ color: '#452B90', fontSize: 18 }}></i></span>
                        </div>
                    </div>
                </div>

                {/* Top bar: agency name, the client and Logout */}
                <div className="header">
                    <div className="header-content">
                        <nav className="navbar navbar-expand">
                            <div className="collapse navbar-collapse justify-content-between">
                                <div className="header-left d-flex align-items-center">
                                    <h5 className="mb-0 text-primary fw-bold">{portal.agencyName}</h5>
                                </div>
                                <ul className="navbar-nav header-right align-items-center">
                                    <li className="nav-item">
                                        <div className="client-user">
                                            <div className="avatar-initial">{(portal.clientName || '?').charAt(0).toUpperCase()}</div>
                                            <div className="client-user-text lh-sm">
                                                <div className="fw-semibold">{portal.clientName}</div>
                                                <small className="text-muted">{portal.clientEmail}</small>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item ms-2">
                                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={logout}>
                                            <i className="fa fa-sign-out-alt me-1"></i>Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="deznav">
                    <div className="deznav-scroll">
                        <ul className="metismenu" id="menu">
                            <li className="menu-title">MY ACCOUNT</li>
                            {MENU.map((item) => {
                                const active = url.startsWith(item.href);
                                return (
                                    <li key={item.href} className={active ? 'mm-active' : ''}>
                                        <a href={item.href} className={active ? 'client-active' : ''} onClick={() => setFolded(false)}>
                                            <div className="menu-icon"><i className={item.icon}></i></div>
                                            <span className="nav-text ms-2">{item.label}</span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Page */}
                <div className="content-body">
                    <div className="container-fluid">
                        <div className="page-title">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li><h1>{title}</h1></li>
                                    <li className="breadcrumb-item active">{portal.agencyName}</li>
                                </ol>
                            </nav>
                        </div>
                        {children}
                    </div>
                </div>

                <div className="footer">
                    <div className="copyright text-center">
                        <p className="mb-0">
                            &copy; {new Date().getFullYear()} {portal.agencyName}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
