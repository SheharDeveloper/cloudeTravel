import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

// ─── Menu Data ────────────────────────────────────────────────────────────────

type MenuItem =
    | { type: 'title'; label: string }
    | { type: 'link'; icon: string; label: string; href: string; permission?: string; adminOnly?: boolean }
    | { type: 'dropdown'; icon: string; label: string; children: { label: string; href: string; soon?: boolean }[] };

// ── Superadmin menu ───────────────────────────────────────────────────────────
const getSuperadminMenuItems = (companyName: string): MenuItem[] => [
    { type: 'title', label: companyName.toUpperCase() },

    { type: 'link', icon: 'fa-solid fa-house', label: 'Dashboard', href: '/dashboard' },

    { type: 'title', label: 'Visa Management' },

    { type: 'link', icon: 'fa-solid fa-tags', label: 'Visa Type', href: '/admin/visa-types', permission: 'visa.view' },
    { type: 'link', icon: 'fa-solid fa-passport', label: 'Visas', href: '/admin/visa-services', permission: 'visa.view' },
    { type: 'link', icon: 'fa-solid fa-file-invoice-dollar', label: 'Tax Setup', href: '/admin/tax-setups' },

    { type: 'title', label: 'OPERATIONS' },

    { type: 'link', icon: 'fa-solid fa-list-check', label: 'Task Board', href: '/admin/tasks' },
    { type: 'link', icon: 'fa-solid fa-calendar-check', label: 'Attendance', href: '/admin/attendance' },
    { type: 'link', icon: 'fa-solid fa-umbrella-beach', label: 'Leave', href: '/admin/leave' },

    { type: 'title', label: 'PEOPLE & ACCESS' },

    { type: 'link', icon: 'fa-solid fa-building', label: 'Agencies', href: '/admin/agency-b2b', permission: 'agency.view' },
    { type: 'link', icon: 'fa-solid fa-users', label: 'Staff', href: '/admin/staff', permission: 'staff.view' },
    { type: 'link', icon: 'fa-solid fa-address-book', label: 'Clients', href: '/admin/clients', permission: 'client.view' },
    { type: 'link', icon: 'fa-solid fa-user-shield', label: 'Roles & Permissions', href: '/admin/roles', permission: 'role.view' },

    { type: 'title', label: 'BOOKINGS & SALES' },

    { type: 'link', icon: 'fa-solid fa-calendar-check', label: 'Bookings', href: '/admin/bookings', permission: 'booking.view' },
    { type: 'link', icon: 'fa-solid fa-envelope', label: 'Contact Requests', href: '/admin/contact-requests', permission: 'contact-request.view' },
    { type: 'link', icon: 'fa-solid fa-quote-left', label: 'Travel Quotes', href: '/admin/travel-quote', permission: 'travel-quote.view' },

    { type: 'title', label: 'WEBSITE' },

    {
        type: 'dropdown',
        icon: 'fa-solid fa-home',
        label: 'Home',
        children: [
            { label: 'Special Offer', href: '/admin/special-offer' },
            { label: 'Hero Images', href: '/admin/hero-image' },
            { label: 'Testimonials', href: '/admin/testimonial' },
        ],
    },

    { type: 'link', icon: 'fa-solid fa-phone', label: 'Contact Info', href: '/admin/contact-info' },
   { type: 'link', icon: 'fa-solid fa-gift', label: 'Package Management', href: '/admin/packages', permission: 'package.view' },
    { type: 'link', icon: 'fa-solid fa-concierge-bell', label: 'Service Management', href: '/admin/services', permission: 'service.view' },

    { type: 'title', label: 'CONTENT & DOCUMENTS' },

    { type: 'link', icon: 'fa-solid fa-file-pdf', label: 'Documents', href: '/admin/documents', permission: 'document.view' },
    { type: 'link', icon: 'fa-solid fa-globe', label: 'Countries', href: '/admin/countries' },
];

// ── Agency menu (Agency Management is superadmin-only) ────────────────────────
const getAgencyMenuItems = (agencyName: string, serviceItems: MenuItem[]): MenuItem[] => [
    { type: 'title', label: agencyName.toUpperCase() },

    { type: 'link', icon: 'fa-solid fa-house', label: 'Dashboard', href: '/dashboard' },

    ...serviceItems,

    { type: 'title', label: 'OPERATIONS' },

    { type: 'link', icon: 'fa-solid fa-list-check', label: 'Task Board', href: '/admin/tasks' },
    { type: 'link', icon: 'fa-solid fa-calendar-check', label: 'Attendance', href: '/admin/attendance' },
    { type: 'link', icon: 'fa-solid fa-umbrella-beach', label: 'Leave', href: '/admin/leave' },

    { type: 'title', label: 'PEOPLE & ACCESS' },

    { type: 'link', icon: 'fa-solid fa-users', label: 'Staff', href: '/admin/staff', permission: 'staff.view' },
    { type: 'link', icon: 'fa-solid fa-address-book', label: 'Clients', href: '/admin/clients', permission: 'client.view' },
    { type: 'link', icon: 'fa-solid fa-user-shield', label: 'Roles & Permissions', href: '/admin/roles', permission: 'role.view' },

    { type: 'title', label: 'BOOKINGS & SALES' },

    { type: 'link', icon: 'fa-solid fa-calendar-check', label: 'Bookings', href: '/admin/bookings', permission: 'booking.view' },
];

// Where each service id opens. A service without an entry has no page yet and
// shows as "Soon". Staff see a page's entries only with its permission.
// The first entry carries the service's own name; later ones need a label.
const SERVICE_PAGES: Record<string, { label?: string; href: string; permission?: string }[]> = {
    visa: [
        { href: '/admin/visa-search', permission: 'visa.view' },
    ],
};

const buildServiceItems = (
    services: { id: string; name: string }[],
    canSee: (permission?: string) => boolean,
): MenuItem[] => {
    const children = services.flatMap((service) => {
        const pages = SERVICE_PAGES[service.id];
        if (!pages) return [{ label: service.name, href: '#', soon: true }];
        return pages
            .filter((page) => canSee(page.permission))
            .map((page) => ({ label: page.label ?? service.name, href: page.href }));
    });

    if (children.length === 0) return [];

    return [
        { type: 'title', label: 'SERVICES' },
        { type: 'dropdown', icon: 'fa-solid fa-concierge-bell', label: 'Services', children },
    ];
};

// Commented out menu items for future use
// { type: 'link', icon: 'fa-solid fa-passport', label: 'Visa Services', href: '/admin/visa-services' },
// { type: 'link', icon: 'fa-solid fa-briefcase', label: 'Other Services', href: '/admin/other-services' },
// { type: 'link', icon: 'fa-solid fa-images', label: 'Images', href: '/admin/images' },
// { type: 'link', icon: 'fa-solid fa-users', label: 'Users', href: '/admin/users' },
// { type: 'link', icon: 'fa-solid fa-cog', label: 'Settings', href: '/admin/settings' },
// { type: 'title', label: 'Travel Services' },
// { type: 'title', label: 'Employee Management' },
// { type: 'title', label: 'Finance' },
// { type: 'title', label: 'Operations' },
// { type: 'title', label: 'Approvals & Legal' },

// ─── Dropdown Item ────────────────────────────────────────────────────────────

function DropdownItem({ icon, label, children, currentPath }: { icon: string; label: string; children: { label: string; href: string; soon?: boolean }[]; currentPath: string }) {

    // Check if any child is active
    const hasActiveChild = children.some(c => !c.soon && currentPath.startsWith(c.href));

    // Auto-open if a child is active, otherwise closed
    const [open, setOpen] = useState(hasActiveChild);

    useEffect(() => {
        setOpen(hasActiveChild);
    }, [hasActiveChild]);

    return (
        <li className={open ? 'mm-active' : ''}>
            <a
                className={`has-arrow${open ? ' mm-active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); setOpen(!open); }}
                aria-expanded={open}
            >
                <div className="menu-icon"><i className={icon}></i></div>
                <span className="nav-text ms-2">{label}</span>
            </a>
            <ul
                className={`mm-collapse${open ? ' mm-show' : ''}`}
                style={{ display: open ? 'block' : 'none' }}
                aria-expanded={open}
            >
                {children.map((c) => {
                    if (c.soon) {
                        return (
                            <li key={c.label}>
                                <a href="#" onClick={(e) => e.preventDefault()} style={{ opacity: 0.55, cursor: 'default' }}>
                                    {c.label} <small className="ms-1">(Soon)</small>
                                </a>
                            </li>
                        );
                    }
                    const isActive = currentPath.startsWith(c.href);
                    return (
                        <li key={c.href} className={isActive ? 'mm-active' : ''}>
                            <a href={c.href} className={isActive ? 'sidebar-active' : ''}>
                                {c.label}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </li>
    );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
    const { name, authAgency, authPermissions, isStaffSession, agencyServices } = usePage().props as any;
    const { url } = usePage();
    const companyName = authAgency?.agency_name || (name as string) || 'CloudTravel';
    // Staff need the page's permission; the agency owner gets every service the superadmin assigned.
    const canSee = (permission?: string) =>
        !permission || !isStaffSession || !authPermissions || authPermissions.includes(permission);
    const allItems = authAgency
        ? getAgencyMenuItems(companyName, buildServiceItems(agencyServices ?? [], canSee))
        : getSuperadminMenuItems(companyName);

    // authPermissions is null when nobody is signed in; otherwise it is the
    // permission list for the session (agency permissions, or the user's roles).
    const allowed = (item: MenuItem) => {
        if (item.type !== 'link') return true;
        if (item.adminOnly && isStaffSession) return false;
        return !item.permission || !authPermissions || authPermissions.includes(item.permission);
    };

    // Drop links the session lacks, then any section title left with no links.
    const kept = allItems.filter(allowed);
    const menuItems = kept.filter((item, i) => {
        if (item.type !== 'title') return true;
        const next = kept[i + 1];
        return next !== undefined && next.type !== 'title';
    });
    const currentPath = url || '';

    return (
        <div className="deznav">
            <style>{`
                .sidebar-active {
                    color: #ffc107 !important;
                    font-weight: 600 !important;
                }
                .deznav-scroll {
                    overflow-y: auto !important;
                    scrollbar-width: thin !important;
                    scrollbar-color: rgba(255, 255, 255, 0.25) transparent !important;
                }
                .deznav-scroll::-webkit-scrollbar {
                    width: 6px !important;
                    opacity: 1 !important;
                }
                .deznav-scroll::-webkit-scrollbar-track {
                    background: transparent !important;
                }
                .deznav-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.25) !important;
                    border-radius: 10px !important;
                }
                .deznav-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.4) !important;
                }
            `}</style>
            <div className="deznav-scroll">
                <ul className="metismenu" id="menu">
                    {menuItems.map((item: MenuItem, i: number) => {
                        if (item.type === 'title') {
                            return <li key={i} className="menu-title">{item.label}</li>;
                        }

                        if (item.type === 'link') {
                            const isActive = currentPath.startsWith(item.href);
                            return (
                                <li key={i}>
                                    <a href={item.href} className={isActive ? 'sidebar-active' : ''}>
                                        <div className="menu-icon"><i className={item.icon}></i></div>
                                        <span className="nav-text ms-2">{item.label}</span>
                                    </a>
                                </li>
                            );
                        }

                        return (
                            <DropdownItem
                                key={i}
                                icon={item.icon}
                                label={item.label}
                                children={item.children}
                                currentPath={currentPath}
                            />
                        );
                    })}
                </ul>

                <div className="deznav-footer">
                    <a href="#" className="btn btn-success w-100">
                        <span>Docs &amp; Components</span>
                        <i className="fa-solid fa-arrow-up rotate-x ms-1"></i>
                    </a>
                </div>
            </div>
        </div>
    );
}
