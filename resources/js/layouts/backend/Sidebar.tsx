import { useState } from 'react';

// ─── Menu Data ────────────────────────────────────────────────────────────────

type MenuItem =
    | { type: 'title'; label: string }
    | { type: 'link'; icon: string; label: string; href: string }
    | { type: 'dropdown'; icon: string; label: string; children: { label: string; href: string }[] };

const menuItems: MenuItem[] = [
    { type: 'title', label: 'YOUR COMPANY' },

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

    // { type: 'link', icon: 'fa-solid fa-passport', label: 'Visa Services', href: '/admin/visa-services' },
    // { type: 'link', icon: 'fa-solid fa-briefcase', label: 'Other Services', href: '/admin/other-services' },
    // { type: 'link', icon: 'fa-solid fa-images', label: 'Images', href: '/admin/images' },
    // { type: 'link', icon: 'fa-solid fa-users', label: 'Users', href: '/admin/users' },
    // { type: 'link', icon: 'fa-solid fa-cog', label: 'Settings', href: '/admin/settings' },

    // { type: 'title', label: 'Travel Services' },
    // {
    //     type: 'dropdown',
    //     icon: 'fa-solid fa-passport',
    //     label: 'Visa',
    //     children: [
    //         { label: 'Dashboard', href: '/visa/dashboard' },
    //         { label: 'Applications', href: '/visa/applications' },
    //         { label: 'New Application', href: '/visa/create' },
    //         { label: 'Status Tracking', href: '/visa/status' },
    //         { label: 'Documents', href: '/visa/documents' },
    //     ],
    // },
    // {
    //     type: 'dropdown',
    //     icon: 'fa-solid fa-taxi',
    //     label: 'Cab',
    //     children: [
    //         { label: 'Dashboard', href: '/cab/dashboard' },
    //         { label: 'Bookings', href: '/cab/bookings' },
    //         { label: 'New Booking', href: '/cab/create' },
    //         { label: 'Drivers', href: '/cab/drivers' },
    //         { label: 'Vehicles', href: '/cab/vehicles' },
    //     ],
    // },
    // {
    //     type: 'dropdown',
    //     icon: 'fa-solid fa-hotel',
    //     label: 'Hotel',
    //     children: [
    //         { label: 'Dashboard', href: '/hotel/dashboard' },
    //         { label: 'Bookings', href: '/hotel/bookings' },
    //         { label: 'New Booking', href: '/hotel/create' },
    //         { label: 'Properties', href: '/hotel/properties' },
    //         { label: 'Room Types', href: '/hotel/room-types' },
    //     ],
    // },
    // {
    //     type: 'dropdown',
    //     icon: 'fa-solid fa-plane',
    //     label: 'Flight',
    //     children: [
    //         { label: 'Dashboard', href: '/flight/dashboard' },
    //         { label: 'Bookings', href: '/flight/bookings' },
    //         { label: 'New Booking', href: '/flight/create' },
    //         { label: 'Search Flights', href: '/flight/search' },
    //         { label: 'Passengers', href: '/flight/passengers' },
    //     ],
    // },

    // { type: 'title', label: 'Employee Management' },
    // { type: 'link', icon: 'fa-solid fa-user-tie', label: 'Employees', href: '/employees' },
    // { type: 'link', icon: 'fa-solid fa-building', label: 'Department', href: '/departments' },
    // { type: 'link', icon: 'fa-solid fa-id-badge', label: 'Designation', href: '/designations' },
    // { type: 'link', icon: 'fa-solid fa-clock', label: 'Shift', href: '/shifts' },
    // {
    //     type: 'dropdown',
    //     icon: 'fa-solid fa-calendar-check',
    //     label: 'Attendance',
    //     children: [
    //         { label: 'Employees', href: '/attendance/employees' },
    //         { label: 'Admin', href: '/attendance/admin' },
    //     ],
    // },
    // {
    //     type: 'dropdown',
    //     icon: 'fa-solid fa-calendar-minus',
    //     label: 'Leave',
    //     children: [
    //         { label: 'Admin Leaves', href: '/leaves/admin' },
    //         { label: 'Employee Leaves', href: '/leaves/employees' },
    //         { label: 'Leave Type', href: '/leave-types' },
    //     ],
    // },
    // { type: 'link', icon: 'fa-solid fa-umbrella-beach', label: 'Holiday', href: '/holidays' },
    // {
    //     type: 'dropdown',
    //     icon: 'fa-solid fa-money-check-dollar',
    //     label: 'Payroll',
    //     children: [
    //         { label: 'Employee Salary', href: '/payroll/employee-salary' },
    //         { label: 'Payslip', href: '/payroll/payslip' },
    //     ],
    // },

    // { type: 'title', label: 'Finance' },

    // { type: 'link', icon: 'fa-solid fa-file-invoice-dollar', label: 'Invoice', href: '/invoices' },

    // { type: 'title', label: 'Operations' },

    // { type: 'link', icon: 'fa-solid fa-id-card', label: 'Licence', href: '/licences' },
    // { type: 'link', icon: 'fa-solid fa-gears', label: 'Operation', href: '/operations' },
    // { type: 'link', icon: 'fa-solid fa-clipboard-list', label: 'Assignment', href: '/assignments' },
    // { type: 'link', icon: 'fa-solid fa-comments', label: 'Conversation', href: '/conversations' },

    // { type: 'title', label: 'Approvals & Legal' },

    // { type: 'link', icon: 'fa-solid fa-right-left', label: 'Transaction', href: '/transactions' },
    // { type: 'link', icon: 'fa-solid fa-circle-check', label: 'Approval', href: '/approvals' },
    // { type: 'link', icon: 'fa-solid fa-scale-balanced', label: 'Terms & Conditions', href: '/terms' },
];

// ─── Dropdown Item ────────────────────────────────────────────────────────────

function DropdownItem({ icon, label, children }: { icon: string; label: string; children: { label: string; href: string }[] }) {
    const [open, setOpen] = useState(false);

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
                {children.map((c) => (
                    <li key={c.href}><a href={c.href}>{c.label}</a></li>
                ))}
            </ul>
        </li>
    );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
    return (
        <div className="deznav">
            <div className="deznav-scroll">
                <ul className="metismenu" id="menu">
                    {menuItems.map((item, i) => {
                        if (item.type === 'title') {
                            return <li key={i} className="menu-title">{item.label}</li>;
                        }

                        if (item.type === 'link') {
                            return (
                                <li key={i}>
                                    <a href={item.href}>
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
