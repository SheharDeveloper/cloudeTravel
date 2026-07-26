import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

// ─── Menu Data ────────────────────────────────────────────────────────────────

type MenuItem =
    | { type: 'title'; label: string }
    | { type: 'link'; icon: string; label: string; href: string }
    | { type: 'dropdown'; icon: string; label: string; children: { label: string; href: string }[] };

const getMenuItems = (companyName: string): MenuItem[] => [
    { type: 'title', label: companyName.toUpperCase() },

    { type: 'link', icon: 'fa-solid fa-house', label: 'Dashboard', href: '/dashboard' },

    // { type: 'title', label: 'TOUR MANAGEMENT' },

    // {
    //     type: 'dropdown',
    //     icon: 'fa-solid fa-plane',
    //     label: 'Tours',
    //     children: [
    //         { label: 'All Tours', href: '/admin/tours' },
    //         { label: 'Add New Tour', href: '/admin/tours/create' },
    //     ],
    // },

    { type: 'title', label: 'BOOKING MANAGEMENT' },

    { type: 'link', icon: 'fa-solid fa-calendar-check', label: 'Bookings', href: '/admin/bookings' },
    { type: 'link', icon: 'fa-solid fa-envelope', label: 'Contact Requests', href: '/admin/contact-requests' },

    { type: 'title', label: 'WEBSITE MANAGEMENT' },

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

    { type: 'link', icon: 'fa-solid fa-passport', label: 'Visa Management', href: '/admin/visa-services' },
    { type: 'link', icon: 'fa-solid fa-gift', label: 'Package Management', href: '/admin/packages' },
    { type: 'link', icon: 'fa-solid fa-concierge-bell', label: 'Service Management', href: '/admin/services' },

    { type: 'title', label: 'PUBLIC & LEGAL' },

    { type: 'link', icon: 'fa-solid fa-file-pdf', label: 'Documents', href: '/admin/documents' },

    { type: 'title', label: 'QUOTATIONS' },

    { type: 'link', icon: 'fa-solid fa-quote-left', label: 'Travel Quote', href: '/admin/travel-quote' },
];

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

function DropdownItem({ icon, label, children, currentPath }: { icon: string; label: string; children: { label: string; href: string }[]; currentPath: string }) {

    // Check if any child is active
    const hasActiveChild = children.some(c => currentPath.startsWith(c.href));

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
    const { name } = usePage().props;
    const { url } = usePage();
    const companyName = (name as string) || 'CloudTravel';
    const menuItems = getMenuItems(companyName);
    const currentPath = url || '';

    return (
        <div className="deznav">
            <style>{`
                .sidebar-active {
                    color: #ffc107 !important;
                    font-weight: 600 !important;
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
