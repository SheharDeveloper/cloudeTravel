import { router } from '@inertiajs/react';

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

interface SpecialOffersProps {
    activeOfferTab: string;
    handleOfferTabChange: (tab: string) => void;
    specialOffers: SpecialOffer[];
    currency: Currency;
}

export default function SpecialOffers({
    activeOfferTab,
    handleOfferTabChange,
    specialOffers,
    currency
}: SpecialOffersProps) {

    const flightOffers = specialOffers.filter(o => o.is_featured && o.type === 'Flight');
    const hotelOffers = specialOffers.filter(o => o.is_featured && o.type === 'Hotel');
    const packageOffers = specialOffers.filter(o => o.is_featured && o.type === 'Package');
    const visaOffers = specialOffers.filter(o => o.is_featured && o.type === 'Visa');
    const transportOffers = specialOffers.filter(o => o.is_featured && o.type === 'Transportation');
    const totalOffers = flightOffers.length + hotelOffers.length + packageOffers.length + visaOffers.length + transportOffers.length;

    return (
        <section style={{ padding: '50px 20px', background: '#ffffff' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#000000', marginBottom: '12px' }}>
                        <i className="fa fa-tag" style={{ color: '#000000', marginRight: '10px' }}></i>
                        Prices are down, summer is on
                    </h2>
                    <div style={{ width: '50px', height: '3px', background: '#0499ff', margin: '0 auto 15px' }}></div>
                    <p style={{ color: '#000000', fontSize: '13px', maxWidth: '600px', margin: '0 auto' }}>
                        Discover our exclusive featured packages for unforgettable getaways
                    </p>
                </div>

                {totalOffers === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999', animation: 'fadeInUp 0.4s ease' }}>
                        <i className="fa fa-calendar" style={{ fontSize: '64px', marginBottom: '20px', display: 'block', color: '#ddd' }}></i>
                        <h3 style={{ fontSize: '24px', color: '#666', marginBottom: '12px' }}>Offer is Coming Soon</h3>
                        <p style={{ fontSize: '15px', color: '#999' }}>We're preparing exclusive offers for you. Check back soon!</p>
                    </div>
                ) : (
                    <>


                {/* FLIGHTS SECTION */}
                {activeOfferTab === 'flight' && (
                    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                        {flightOffers.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                {flightOffers.map((offer) => (
                                    <OfferCard key={offer.id} offer={offer} currency={currency} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                                <i className="fa fa-calendar" style={{ fontSize: '48px', marginBottom: '15px', display: 'block', color: '#ddd' }}></i>
                                <h3 style={{ fontSize: '20px', color: '#666', marginBottom: '8px' }}>Coming Soon</h3>
                                <p style={{ fontSize: '14px', color: '#999' }}>Flight offers are on the way. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* HOTELS SECTION */}
                {activeOfferTab === 'hotel' && (
                    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                        {hotelOffers.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                {hotelOffers.map((offer) => (
                                    <OfferCard key={offer.id} offer={offer} currency={currency} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                                <i className="fa fa-calendar" style={{ fontSize: '48px', marginBottom: '15px', display: 'block', color: '#ddd' }}></i>
                                <h3 style={{ fontSize: '20px', color: '#666', marginBottom: '8px' }}>Coming Soon</h3>
                                <p style={{ fontSize: '14px', color: '#999' }}>Hotel offers are on the way. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* PACKAGES SECTION */}
                {activeOfferTab === 'package' && (
                    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                        {packageOffers.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                {packageOffers.map((offer) => (
                                    <OfferCard key={offer.id} offer={offer} currency={currency} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                                <i className="fa fa-calendar" style={{ fontSize: '48px', marginBottom: '15px', display: 'block', color: '#ddd' }}></i>
                                <h3 style={{ fontSize: '20px', color: '#666', marginBottom: '8px' }}>Coming Soon</h3>
                                <p style={{ fontSize: '14px', color: '#999' }}>Package offers are on the way. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* VISA SECTION */}
                {activeOfferTab === 'visa' && (
                    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                        {visaOffers.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                {visaOffers.map((offer) => (
                                    <OfferCard key={offer.id} offer={offer} currency={currency} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                                <i className="fa fa-calendar" style={{ fontSize: '48px', marginBottom: '15px', display: 'block', color: '#ddd' }}></i>
                                <h3 style={{ fontSize: '20px', color: '#666', marginBottom: '8px' }}>Coming Soon</h3>
                                <p style={{ fontSize: '14px', color: '#999' }}>Visa offers are on the way. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* TRANSPORTATION SECTION */}
                {activeOfferTab === 'airport-transfer' && (
                    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                        {transportOffers.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                {transportOffers.map((offer) => (
                                    <OfferCard key={offer.id} offer={offer} currency={currency} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                                <i className="fa fa-calendar" style={{ fontSize: '48px', marginBottom: '15px', display: 'block', color: '#ddd' }}></i>
                                <h3 style={{ fontSize: '20px', color: '#666', marginBottom: '8px' }}>Coming Soon</h3>
                                <p style={{ fontSize: '14px', color: '#999' }}>Transportation offers are on the way. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                )}
                    </>
                )}

                {/* SEE MORE BUTTON */}
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button
                        onClick={() => router.visit('/all-offers')}
                        style={{
                            background: '#0499ff',
                            color: '#ffffff',
                            border: 'none',
                            padding: '12px 30px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#0284d0';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#0499ff';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        See More
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes marqueeOffer {
                    0% {
                        opacity: 0;
                        transform: translateX(-100px);
                    }
                    12.5% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    62.5% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    75% {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                }
                .offer-marquee {
                    animation: marqueeOffer 4s ease-in-out;
                    display: inline-block;
                    white-space: normal;
                    word-wrap: break-word;
                }
                @media (max-width: 768px) {
                    .offer-marquee {
                        white-space: normal !important;
                        padding: 0 5px;
                    }
                }
            `}</style>

        </section>
    );
}

function OfferCard({ offer, currency }: { offer: SpecialOffer; currency: Currency }) {
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
                    <img src={`/storage/${offer.images[0].image_path}`} alt={offer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff', fontSize: '48px' }}>
                        <i className="fa fa-gift"></i>
                    </div>
                )}
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#e74c3c', color: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>Price drop</span>
                {offer.is_featured && (
                    <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#f39c12', color: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>Most loved</span>
                )}
            </div>

            <div style={{ padding: '18px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#000000', marginBottom: '8px' }}>{offer.name}</h4>
                <p style={{ fontSize: '12px', color: '#666666', marginBottom: '12px', lineHeight: 1.4 }}>
                    {offer.flight_name || offer.hotel_name || offer.description?.substring(0, 50)}
                </p>
                {offer.rating && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            {[...Array(Math.floor(offer.rating))].map((_, i) => (
                                <span key={i} style={{ color: '#000000', fontSize: '12px' }}>★</span>
                            ))}
                        </div>
                        <span style={{ fontSize: '11px', color: '#666666' }}>{offer.rating} (48 reviews)</span>
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
