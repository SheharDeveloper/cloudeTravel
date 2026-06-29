import MasterLayout from '@/layouts/backend/MasterLayout';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { ProtectedRoute } from '@/lib/ProtectedRoute';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [latestBookings, setLatestBookings] = useState<any[]>([]);

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
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchLatestBookings = async () => {
            try {
                const response = await apiFetch('/api/bookings?per_page=5', {
                    method: 'GET',
                });
                if (response.ok) {
                    const data = await response.json();
                    setLatestBookings(data.data || []);
                }
            } catch (err) {
                console.error('Error fetching bookings:', err);
            }
        };
        fetchLatestBookings();
    }, []);

    const userName = user?.name || user?.email || 'Admin';

    return (
        <ProtectedRoute>
            <MasterLayout title="Dashboard">

            {/* Page Title */}
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Dashboard</h1></li>
                        <li className="breadcrumb-item">
                            <a href="/dashboard">
                                <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Home
                            </a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                    </ol>
                </nav>
            </div>

            <div className="row">

                {/* Congratulations */}
                <div className="col-xl-6">
                    <div className="card overflow-hidden">
                        <div className="card-body">
                            <div>
                                <h4 className="fs-16 mb-0">Congratulations <strong>{loading ? 'Loading...' : userName}!</strong></h4>
                                <span>Welcome back to CloudTravel</span>
                            </div>
                            <div className="position-relative">
                                <div className="mt-3">
                                    <span className="d-block mb-5">Manage your agencies and documents efficiently from your dashboard.</span>
                                    <a href="/agency" className="btn btn-primary btn-sm">View Agencies</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sales Overview */}
                <div className="col-xl-3 col-md-6">
                    <div className="card bg-primary">
                        <div className="card-header border-0 pb-2">
                            <h6 className="card-title text-white">Overview Of Sales</h6>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-6">
                                    <div className="bg-white bg-opacity-10 text-center p-3 rounded-2">
                                        <h4 className="m-0 mt-2 text-white">$3,651</h4>
                                        <span className="text-white">Total Sales</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="bg-white bg-opacity-10 text-center p-3 rounded-2">
                                        <h4 className="m-0 mt-2 text-white">5,831</h4>
                                        <span className="text-white">Orders</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Profit */}
                <div className="col-xl-3 col-md-6">
                    <div className="card">
                        <div className="card-header border-0">
                            <div className="d-flex align-items-center">
                                <div className="ms-2">
                                    <h6 className="fs-15 mb-0">Total Profit</h6>
                                    <span>$2,520</span>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <h3>$2,520</h3>
                            <span className="text-success">+12% this month</span>
                        </div>
                    </div>
                </div>

                {/* Analytics */}
                <div className="col-xl-12">
                    <div className="card bg-primary bg-opacity-10 border-0">
                        <div className="card-body mt-xl-4 mt-0 pb-1">
                            <div className="row align-items-center">
                                <div className="col-xl-2">
                                    <h3 className="mb-3">Analytics</h3>
                                    <p className="mb-0 text-primary pb-4">Your statistics for 1 month period.</p>
                                </div>
                                <div className="col-xl-10">
                                    <div className="row">
                                        {[
                                            { icon: 'fa-solid fa-basketball', name: 'Dribble', handle: '@statistics', value: '+23%' },
                                            { icon: 'fa-brands fa-facebook-f', name: 'Facebook', handle: '@fb', value: '-33%' },
                                            { icon: 'fa-brands fa-amazon', name: 'Amazon', handle: '@hemsr', value: '-23%' },
                                            { icon: 'fa-brands fa-behance', name: 'Behance', handle: '@behan', value: '+25%' },
                                            { icon: 'fa-brands fa-aws', name: 'AWS', handle: '@awes', value: '+30%' },
                                            { icon: 'fa-brands fa-instagram', name: 'Instagram', handle: '@abcd', value: '-32%' },
                                        ].map((item) => (
                                            <div key={item.name} className="col-xl-2 col-sm-4 col-6">
                                                <div className="card ov-card">
                                                    <div className="card-body">
                                                        <div className="handle-icon">
                                                            <div className="avatar avatar-sm bg-primary rounded-circle">
                                                                <i className={`${item.icon} text-white`}></i>
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <h5>{item.name}</h5>
                                                            <span>{item.handle}</span>
                                                            <h3 className="m-0 mt-4">{item.value}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Earning Report */}
                <div className="col-xl-12 col-xxl-6">
                    <div className="card">
                        <div className="card-header border-0">
                            <h5 className="card-title mb-0">Reports Of Earning</h5>
                        </div>
                        <div className="card-body py-0">
                            <div className="row align-items-center">
                                {[
                                    { label: 'Earning', amount: '$2,256', color: 'secondary' },
                                    { label: 'Profit', amount: '$3,367', color: 'primary' },
                                    { label: 'Expense', amount: '$3,567', color: 'info' },
                                ].map((item) => (
                                    <div key={item.label} className="col-xl-4 col-sm-4">
                                        <div className="card">
                                            <div className="card-header border-0 p-2">
                                                <div className="d-flex align-items-center">
                                                    <div className={`avatar avatar-xs border-0 bg-${item.color} bg-opacity-25`}>
                                                        <i className={`fa-solid fa-dollar-sign text-${item.color}`}></i>
                                                    </div>
                                                    <div className="ms-2">
                                                        <h6 className="mb-0">{item.label}</h6>
                                                        <span>{item.amount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Country Sale */}
                <div className="col-xl-6 col-xxl-3 col-md-6">
                    <div className="card">
                        <div className="card-header border-0">
                            <div>
                                <h4 className="mb-0">Country Sale</h4>
                                <span>Weekly Sales</span>
                            </div>
                        </div>
                        <div className="card-body p-0 pb-3">
                            <ul className="dz-scroll height360">
                                {[
                                    { country: 'India', amount: '$9,525', pct: '25.8%', up: true, flag: 'india_2.png' },
                                    { country: 'Canada', amount: '$5,366', pct: '18.5%', up: false, flag: 'canada_2.png' },
                                    { country: 'China', amount: '$65', pct: '59.5%', up: true, flag: 'china_2.png' },
                                    { country: 'UK', amount: '$3,162', pct: '60.5%', up: true, flag: 'united-kingdom_2.png' },
                                    { country: 'USA', amount: '$1,235', pct: '60.5%', up: false, flag: 'usa_2.png' },
                                ].map((item) => (
                                    <li key={item.country} className="d-flex px-3 mb-3">
                                        <div>
                                            <img src={`/backend/assets/images/country/${item.flag}`} alt={item.country} className="avatar avatar-xs rounded-circle" />
                                        </div>
                                        <div className="d-flex flex-wrap align-items-center justify-content-between w-100">
                                            <div className="ms-2">
                                                <h6 className="mb-0">{item.amount}</h6>
                                                <small>{item.country}</small>
                                            </div>
                                            <span className={`badge bg-${item.up ? 'primary' : 'secondary'} border-0 ms-2`}>
                                                {item.pct}
                                                <i className={`fa-solid fa-chevron-${item.up ? 'up' : 'down'} ms-2 text-white`}></i>
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

            </MasterLayout>
        </ProtectedRoute>
    );
}
