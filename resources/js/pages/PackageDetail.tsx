import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import BookingModal from '@/components/BookingModal';

interface Package {
    id: number;
    uid: string;
    name: string;
    title: string;
    image?: string;
    description?: string;
    price: number;
    currency: string;
    origin_country?: string;
    destination_country: string;
    hotel_name?: string;
    hotel_stars: number;
    duration_days: number;
    travel_export_included: boolean;
    visa_service_included: boolean;
    status: boolean;
    is_featured: boolean;
}

interface Props {
    package: Package;
}

export default function PackageDetail({ package: pkg }: Props) {
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [checkInDate, setCheckInDate] = useState('');
    const [nights, setNights] = useState(pkg.duration_days);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);

    const handleBook = () => {
        if (!checkInDate) {
            alert('Please select a check-in date');
            return;
        }
        setShowBookingModal(true);
    };

    const handleCloseModal = () => {
        setShowBookingModal(false);
    };


    return (
        <>
            <Head title={pkg.name} />
            <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
                {/* Hero Section */}
                {pkg.image && (
                    <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
                        <img
                            src={pkg.image}
                            alt={pkg.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                )}

                {/* Content Section */}
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>
                            {pkg.name}
                        </h1>
                        <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
                            {pkg.title}
                        </p>

                        {/* Price Badge */}
                        <div style={{
                            display: 'inline-block',
                            background: '#0499ff',
                            color: '#fff',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontSize: '20px',
                            fontWeight: 700,
                        }}>
                            £{pkg.price.toLocaleString()}
                        </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginBottom: '40px',
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,.1)',
                    }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#999', fontWeight: 700, marginBottom: '4px' }}>
                                DESTINATION
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#003d82' }}>
                                {pkg.destination_country}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '12px', color: '#999', fontWeight: 700, marginBottom: '4px' }}>
                                DURATION
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#003d82' }}>
                                {pkg.duration_days} Days
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '12px', color: '#999', fontWeight: 700, marginBottom: '4px' }}>
                                HOTEL RATING
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#003d82' }}>
                                ⭐ {pkg.hotel_stars} Stars
                            </div>
                        </div>

                        {pkg.hotel_name && (
                            <div>
                                <div style={{ fontSize: '12px', color: '#999', fontWeight: 700, marginBottom: '4px' }}>
                                    HOTEL
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 700, color: '#003d82' }}>
                                    {pkg.hotel_name}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {pkg.description && (
                        <div style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            marginBottom: '40px',
                            boxShadow: '0 2px 8px rgba(0,0,0,.1)',
                        }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#003d82', marginBottom: '12px' }}>
                                About This Package
                            </h2>
                            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#555' }}>
                                {pkg.description}
                            </p>
                        </div>
                    )}

                    {/* Inclusions */}
                    <div style={{
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '40px',
                        boxShadow: '0 2px 8px rgba(0,0,0,.1)',
                    }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#003d82', marginBottom: '16px' }}>
                            What's Included
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '18px' }}>✓</span>
                                <span style={{ color: '#555' }}>Hotel Accommodation</span>
                            </div>
                            {pkg.visa_service_included && (
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '18px', color: '#0499ff' }}>✓</span>
                                    <span style={{ color: '#555' }}>Visa Service</span>
                                </div>
                            )}
                            {pkg.travel_export_included && (
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '18px', color: '#0499ff' }}>✓</span>
                                    <span style={{ color: '#555' }}>Travel Insurance</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '18px' }}>✓</span>
                                <span style={{ color: '#555' }}>24/7 Support</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form - 3 Columns Like Home Page with Popups */}
                    {!showBookingModal && (
                        <div style={{ background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
                            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px', alignItems: 'flex-end' }}>
                                    {/* Check-in Date */}
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#666', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                                            Check-in Date
                                        </label>
                                        <input
                                            type="date"
                                            value={checkInDate}
                                            onChange={(e) => setCheckInDate(e.target.value)}
                                            onClick={() => setShowDatePicker(!showDatePicker)}
                                            placeholder="Select date"
                                            style={{
                                                width: '100%',
                                                padding: '12px 14px',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '4px',
                                                fontSize: '13px',
                                                boxSizing: 'border-box',
                                                background: '#fff',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </div>

                                    {/* Nights */}
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#666', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                                            Nights
                                        </label>
                                        <select
                                            value={nights}
                                            onChange={(e) => setNights(parseInt(e.target.value))}
                                            style={{
                                                width: '100%',
                                                padding: '12px 14px',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '4px',
                                                fontSize: '13px',
                                                boxSizing: 'border-box',
                                                background: '#fff',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 21, 28].map(n => (
                                                <option key={n} value={n}>{n} nights</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Guests & Rooms - Popup Button */}
                                    <div style={{ position: 'relative' }}>
                                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#666', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                                            Guests & Rooms
                                        </label>
                                        <div
                                            onClick={() => setShowGuestModal(!showGuestModal)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                height: '54px',
                                                border: '1.5px solid #ddd',
                                                borderRadius: '10px',
                                                background: '#fff',
                                                padding: '0 16px',
                                                cursor: 'pointer',
                                                transition: 'border-color 0.3s',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ccc')}
                                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#ddd')}
                                        >
                                            <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                                                <i className="fa fa-users" style={{ marginRight: '8px', color: '#0066cc' }}></i>
                                                {adults} Adult{adults !== 1 ? 's' : ''} • {children} Child{children !== 1 ? 'ren' : ''} • {rooms} Room{rooms !== 1 ? 's' : ''}
                                            </div>
                                            <i className="fa fa-chevron-down" style={{ fontSize: '12px', color: '#999' }}></i>
                                        </div>

                                        {/* Guest Modal - Dropdown */}
                                        {showGuestModal && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '12px', boxShadow: '0 12px 48px rgba(0,0,0,.3)', zIndex: 9999, border: '1px solid #e0e0e0', padding: '24px' }}>
                                                {/* Rooms */}
                                                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <p style={{ fontSize: '14px', color: '#333', margin: 0, fontWeight: 600 }}>Rooms</p>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <button onClick={() => setRooms(Math.max(1, rooms - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#333', minWidth: '24px', textAlign: 'center' }}>{rooms}</span>
                                                            <button onClick={() => setRooms(Math.min(8, rooms + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Adults */}
                                                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <p style={{ fontSize: '14px', color: '#333', margin: 0, fontWeight: 600 }}>Adults</p>
                                                            <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0 0' }}>18 yrs or above</p>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <button onClick={() => setAdults(Math.max(1, adults - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#333', minWidth: '24px', textAlign: 'center' }}>{adults}</span>
                                                            <button onClick={() => setAdults(Math.min(8, adults + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Children */}
                                                <div style={{ marginBottom: '0', paddingBottom: '0' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <p style={{ fontSize: '14px', color: '#333', margin: 0, fontWeight: 600 }}>Children</p>
                                                            <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0 0' }}>0 - 17 yrs</p>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <button onClick={() => setChildren(Math.max(0, children - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#333', minWidth: '24px', textAlign: 'center' }}>{children}</span>
                                                            <button onClick={() => setChildren(Math.min(6, children + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Book Button - Full Width Below */}
                                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                    <button
                                        onClick={handleBook}
                                        style={{
                                            padding: '14px 80px',
                                            background: '#0499ff',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 700,
                                            fontSize: '15px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#0284d0')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = '#0499ff')}
                                    >
                                        BOOK
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Booking Modal */}
                    {showBookingModal && (
                        <BookingModal
                            isOpen={showBookingModal}
                            onClose={handleCloseModal}
                            searchDetails={{
                                destinationCountry: pkg.destination_country,
                                packageName: pkg.name,
                                packageUid: pkg.uid,
                                hotelName: pkg.hotel_name,
                                checkInDate,
                                nights,
                                adults,
                                children,
                                rooms,
                            }}
                            serviceType="package"
                        />
                    )}

                    {/* Back Link */}
                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <Link href="/?tab=flight-hotel" style={{
                            color: '#0499ff',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 700,
                        }}>
                            ← Back to Packages
                        </Link>
                    </div>
                </div>
            </div>

        </>
    );
}
