import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { specialOfferService } from '@/services/specialOfferService';

interface SpecialOffer {
    id: number;
    uid: string;
    name: string;
    type: string;
    total_price: number;
    is_featured: boolean;
    rating?: number;
    images?: Array<{ id: number; image_path: string; }>;
    flight_name?: string;
    hotel_name?: string;
    hotel_star_rating?: number;
    description?: string;
}

interface Currency {
    symbol: string;
    code: string;
}

export default function AllOffers({ currency }: { currency: Currency }) {
    const [offers, setOffers] = useState<SpecialOffer[]>([]);
    const [filteredOffers, setFilteredOffers] = useState<SpecialOffer[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>(['Flight', 'Hotel', 'Package', 'Visa', 'Transportation']);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [maxPrice, setMaxPrice] = useState(10000);

    useEffect(() => {
        loadOffers();
    }, []);

    useEffect(() => {
        filterOffers();
    }, [offers, selectedTypes, priceRange]);

    const loadOffers = async () => {
        const data = await specialOfferService.getAll();
        setOffers(data);
        if (data.length > 0) {
            const max = Math.max(...data.map(o => o.total_price || 0));
            setMaxPrice(max);
            setPriceRange([0, max]);
        }
    };

    const filterOffers = () => {
        const filtered = offers.filter(o =>
            selectedTypes.includes(o.type) &&
            o.total_price >= priceRange[0] &&
            o.total_price <= priceRange[1]
        );
        setFilteredOffers(filtered);
    };

    const handleTypeToggle = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const offerTypes = ['Flight', 'Hotel', 'Package', 'Visa', 'Transportation'];
    const typeIcons: { [key: string]: string } = {
        'Flight': 'fa-plane',
        'Hotel': 'fa-hotel',
        'Package': 'fa-cube',
        'Visa': 'fa-passport',
        'Transportation': 'fa-car'
    };

    return (
        <>
            <Head title="All Offers - CloudTravel">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            </Head>

            <style>{`
                .range-slider-wrapper {
                    position: relative;
                    margin: 30px 0 20px 0;
                    padding: 10px 0;
                }

                .range-slider-track {
                    width: 100%;
                    height: 8px;
                    background: #e8e8e8;
                    border-radius: 4px;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .range-slider-fill {
                    position: absolute;
                    height: 8px;
                    background: linear-gradient(90deg, #0499ff 0%, #0284d0 100%);
                    border-radius: 4px;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                    box-shadow: 0 2px 6px rgba(4, 153, 255, 0.3);
                }

                .range-slider {
                    width: 100%;
                    height: 8px;
                    background: transparent;
                    border-radius: 4px;
                    outline: none;
                    -webkit-appearance: none;
                    appearance: none;
                    position: relative;
                    z-index: 5;
                    padding: 0;
                    margin: 0;
                }

                .range-slider::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 8px;
                    background: transparent;
                    border-radius: 4px;
                }

                .range-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #0499ff;
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(4, 153, 255, 0.4);
                    transition: all 0.2s ease;
                    margin-top: -6px;
                }

                .range-slider::-webkit-slider-thumb:hover {
                    background: #0284d0;
                    box-shadow: 0 4px 14px rgba(4, 153, 255, 0.6);
                    transform: scale(1.2);
                }

                .range-slider::-webkit-slider-thumb:active {
                    box-shadow: 0 2px 8px rgba(4, 153, 255, 0.8);
                    transform: scale(1.15);
                }

                .range-slider::-moz-range-track {
                    background: transparent;
                    border: none;
                    box-shadow: none;
                }

                .range-slider::-moz-range-progress {
                    background: transparent;
                }

                .range-slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #0499ff;
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(4, 153, 255, 0.4);
                    transition: all 0.2s ease;
                }

                .range-slider::-moz-range-thumb:hover {
                    background: #0284d0;
                    box-shadow: 0 4px 14px rgba(4, 153, 255, 0.6);
                    transform: scale(1.2);
                }

                .range-slider::-moz-range-thumb:active {
                    box-shadow: 0 2px 8px rgba(4, 153, 255, 0.8);
                    transform: scale(1.15);
                }

                .range-slider:first-of-type {
                    z-index: 6;
                }

                .range-slider:last-of-type {
                    z-index: 4;
                }

                .price-display {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                    background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
                    padding: 12px 15px;
                    border-radius: 8px;
                    border: 1px solid #d1e7ff;
                }

                .price-display-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .price-display-label {
                    font-size: 11px;
                    color: #666;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .price-display-value {
                    font-size: 16px;
                    font-weight: 700;
                    color: #0499ff;
                }

                .price-inputs {
                    display: flex;
                    gap: 12px;
                    margin-top: 15px;
                }

                .price-input-group {
                    flex: 1;
                }

                .price-input-label {
                    font-size: 12px;
                    color: #666;
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 600;
                }

                .price-input {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 13px;
                    color: #000000;
                    background: #f9f9f9;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                }

                .price-input:focus {
                    outline: none;
                    border-color: #0499ff;
                    background: #ffffff;
                    box-shadow: 0 0 0 3px rgba(4, 153, 255, 0.1);
                }
            `}</style>

            {/* HERO SECTION */}
            <div style={{ position: 'relative', minHeight: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '50px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,20,60,.5) 0%, rgba(0,20,60,.3) 60%, rgba(0,20,60,.6) 100%)' }}></div>
                <div style={{ position: 'relative', zIndex: 2, padding: '0 20px', maxWidth: '800px' }}>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700, color: '#ffffff', marginBottom: '15px', textShadow: '0 2px 12px rgba(0,0,0,.5)' }}>
                        Explore All Offers
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,.9)', fontSize: '16px', marginBottom: '0', lineHeight: 1.7 }}>
                        Discover our complete collection of travel packages, flights, hotels, visas, and transportation services. Filter by type and price to find your perfect getaway.
                    </p>
                </div>
            </div>

            <div style={{ minHeight: '100vh', background: '#f9f9f9', padding: '40px 20px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
                        {/* LEFT SIDEBAR - FILTERS */}
                        <div style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: 'fit-content' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginBottom: '20px' }}>
                                <i className="fa fa-filter" style={{ marginRight: '8px' }}></i>Filters
                            </h3>

                            {/* OFFER TYPE FILTER */}
                            <div style={{ marginBottom: '30px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#000000', marginBottom: '15px' }}>Offer Type</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {offerTypes.map(type => (
                                        <label key={type} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedTypes.includes(type)}
                                                onChange={() => handleTypeToggle(type)}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                            />
                                            <i className={`fa ${typeIcons[type]}`} style={{ color: '#0499ff', fontSize: '14px', width: '16px' }}></i>
                                            <span style={{ color: '#000000', fontSize: '14px' }}>{type}</span>
                                            <span style={{ marginLeft: 'auto', color: '#999', fontSize: '12px' }}>
                                                ({offers.filter(o => o.type === type).length})
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* PRICE RANGE FILTER */}
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#000000', marginBottom: '20px' }}>
                                    <i className="fa fa-tag" style={{ marginRight: '8px', color: '#0499ff' }}></i>Price Range
                                </h4>

                                <div className="range-slider-wrapper">
                                    <div className="range-slider-track" />
                                    <div
                                        className="range-slider-fill"
                                        style={{
                                            left: `${(priceRange[0] / maxPrice) * 100}%`,
                                            right: `${100 - (priceRange[1] / maxPrice) * 100}%`
                                        }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxPrice}
                                        value={priceRange[0]}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (val <= priceRange[1]) {
                                                setPriceRange([val, priceRange[1]]);
                                            }
                                        }}
                                        className="range-slider"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxPrice}
                                        value={priceRange[1]}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (val >= priceRange[0]) {
                                                setPriceRange([priceRange[0], val]);
                                            }
                                        }}
                                        className="range-slider"
                                    />
                                </div>

                                <div className="price-display">
                                    <div className="price-display-item">
                                        <span className="price-display-label">Minimum</span>
                                        <span className="price-display-value">{currency.symbol}{priceRange[0].toLocaleString()}</span>
                                    </div>
                                    <div style={{ fontSize: '20px', color: '#0499ff', fontWeight: 300 }}>—</div>
                                    <div className="price-display-item">
                                        <span className="price-display-label">Maximum</span>
                                        <span className="price-display-value">{currency.symbol}{priceRange[1].toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="price-inputs">
                                    <div className="price-input-group">
                                        <label className="price-input-label">Min Price</label>
                                        <input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                if (val <= priceRange[1]) {
                                                    setPriceRange([val, priceRange[1]]);
                                                }
                                            }}
                                            className="price-input"
                                        />
                                    </div>
                                    <div className="price-input-group">
                                        <label className="price-input-label">Max Price</label>
                                        <input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || maxPrice;
                                                if (val >= priceRange[0]) {
                                                    setPriceRange([priceRange[0], val]);
                                                }
                                            }}
                                            className="price-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* BACK BUTTON */}
                            <button
                                onClick={() => router.visit('/')}
                                style={{
                                    width: '100%',
                                    marginTop: '30px',
                                    padding: '12px',
                                    background: '#f0f0f0',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#000000',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#e0e0e0';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f0f0f0';
                                }}
                            >
                                ← Back
                            </button>
                        </div>

                        {/* RIGHT SIDE - PACKAGES GRID */}
                        <div>
                            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#000000' }}>
                                    Showing {filteredOffers.length} of {offers.length} packages
                                </h3>
                            </div>

                            {filteredOffers.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                    {filteredOffers.map((offer) => (
                                        <OfferCard key={offer.id} offer={offer} currency={currency} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', borderRadius: '12px' }}>
                                    <i className="fa fa-search" style={{ fontSize: '48px', color: '#ddd', marginBottom: '20px', display: 'block' }}></i>
                                    <h3 style={{ fontSize: '20px', color: '#666', marginBottom: '8px' }}>No Offers Found</h3>
                                    <p style={{ color: '#999' }}>Try adjusting your filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function OfferCard({ offer, currency }: { offer: any; currency: Currency }) {
    return (
        <div
            style={{
                background: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                border: '1px solid #e0e0e0'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
        >
            <div style={{ height: '200px', background: '#f0f0f0', overflow: 'hidden', position: 'relative' }}>
                {offer.images && offer.images.length > 0 ? (
                    <img
                        src={`/storage/${offer.images[0].image_path}`}
                        alt={offer.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#ffffff',
                        fontSize: '48px'
                    }}>
                        <i className="fa fa-gift"></i>
                    </div>
                )}
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#e74c3c', color: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                    {offer.type}
                </span>
                {offer.is_featured && (
                    <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#f39c12', color: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                        Featured
                    </span>
                )}
            </div>

            <div style={{ padding: '18px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#000000', marginBottom: '8px' }}>{offer.name}</h4>
                <p style={{ fontSize: '12px', color: '#666666', marginBottom: '12px', lineHeight: 1.4 }}>
                    {offer.description?.substring(0, 50) || 'Travel package'}
                </p>
                {offer.rating && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            {[...Array(Math.floor(offer.rating))].map((_, i) => (
                                <span key={i} style={{ color: '#000000', fontSize: '12px' }}>★</span>
                            ))}
                        </div>
                        <span style={{ fontSize: '11px', color: '#666666' }}>{offer.rating}</span>
                    </div>
                )}
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginBottom: '12px' }}>
                    {currency.symbol}{offer.total_price?.toLocaleString()}
                </div>
                <button
                    onClick={() => router.visit(`/offers/${offer.uid}`)}
                    style={{
                        width: '100%',
                        background: '#0499ff',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#0284d0';
                        e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#0499ff';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
