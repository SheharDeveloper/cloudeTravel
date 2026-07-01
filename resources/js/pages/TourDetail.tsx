import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { getTour } from '@/services/tourService';

export default function TourDetail() {
  const tourId = window.location.pathname.split('/')[2];
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', dates: '' });
  const [currency, setCurrency] = useState({ symbol: 'Â£', code: 'GBP' });

  useEffect(() => {
    loadTour();
  }, [tourId]);

  const loadTour = async () => {
    try {
      setLoading(true);
      const response = await getTour(parseInt(tourId));
      if (response.success) {
        setTour(response.data);
        if (response.currency) {
          setCurrency(response.currency);
        }
      } else {
        setError(response.message || 'Failed to load tour');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading tour');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Head title="Loading Tour..." />
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p>Loading tour details...</p>
        </div>
      </>
    );
  }

  if (error || !tour) {
    return (
      <>
        <Head title="Tour Not Found" />
        <div style={{ textAlign: 'center', padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#0499ff', marginBottom: '20px' }}>Tour Not Found</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>{error || 'This tour does not exist.'}</p>
          <a href="/tours" style={{ background: '#0499ff', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>
            Back to Tours
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title={tour.tour_title} />

      {/* HERO SECTION WITH BOOKING FORM */}
      <div style={{
        position: 'relative',
        height: '550px',
        backgroundImage: `url(${tour.feature_image || '/images/dummy.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '60px',
        overflow: 'hidden'
      }}>
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,.6) 0%, rgba(0,0,0,.3) 50%, rgba(0,0,0,.1) 100%)'
        }}></div>

        {/* LEFT SIDE - TITLE */}
        <div style={{ position: 'relative', zIndex: 2, flex: 1, padding: '0 40px', color: '#fff', maxWidth: '600px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '52px', margin: '0 0 15px 0', fontWeight: 700, lineHeight: 1.2 }}>
            {tour.tour_title}
          </h1>
          <p style={{ fontSize: '18px', margin: '0 0 20px 0', fontWeight: 500, lineHeight: 1.6, opacity: 0.95 }}>
            {tour.short_description || 'Discover amazing experiences in this curated tour package.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', fontSize: '16px', fontWeight: 500 }}>
            <div>ðŸ“ {tour.country}</div>
            <div>â±ï¸ {tour.duration_days} Days</div>
          </div>
        </div>

        {/* RIGHT SIDE - BOOKING FORM */}
        <div style={{ position: 'relative', zIndex: 2, flex: '0 0 380px', padding: '35px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,.2)', margin: '0 40px 0 0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0499ff', marginBottom: '25px' }}>Book Your Tour</h3>

          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit' }}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit' }}
          />

          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit' }}
          />

          <input
            type="text"
            placeholder="Preferred Dates"
            value={formData.dates}
            onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit' }}
          />

          <div style={{ padding: '15px', background: '#f8fafb', borderRadius: '4px', marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', color: '#999', margin: '0 0 6px 0', textTransform: 'uppercase', fontWeight: 700 }}>Starting from</p>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#ff6b35' }}>
              {tour.early_booking_price_text ? `${currency.symbol}${tour.early_booking_price_text}` : 'Inquire'}
            </span>
          </div>

          <button style={{
            width: '100%',
            padding: '14px',
            background: '#ff6b35',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s'
          }} onMouseEnter={(e) => e.currentTarget.style.background = '#e55a24'} onMouseLeave={(e) => e.currentTarget.style.background = '#ff6b35'}>
            Book Now
          </button>

          <p style={{ fontSize: '12px', color: '#999', margin: '12px 0 0 0', textAlign: 'center' }}>
            ðŸ’³ Create a quick enquiry
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ width: '100%', maxWidth: '1300px', margin: '0 auto', padding: '0 20px 80px 20px' }}>

        {/* HIGHLIGHTS SECTION */}
        {tour.highlights && tour.highlights.length > 0 && (
          <div style={{ marginBottom: '80px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '60px' }}>
              {tour.highlights.slice(0, 4).map((highlight: any, idx: number) => (
                <div key={idx} style={{
                  padding: '30px 20px',
                  background: '#f8fafb',
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0',
                  textAlign: 'center',
                  transition: 'all 0.3s'
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,.1)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', color: '#ff6b35' }}>
                    âœ“
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0499ff', margin: '0 0 8px 0' }}>
                    {highlight.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0, lineHeight: 1.6 }}>
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABOUT SECTION */}
        {tour.full_description && (
          <div style={{ marginBottom: '80px', paddingBottom: '40px', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0499ff', marginBottom: '25px' }}>About This Tour</h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#555', maxWidth: '900px' }}>
              {tour.full_description}
            </p>
          </div>
        )}

        {/* ITINERARY TIMELINE */}
        {tour.itineraries && tour.itineraries.length > 0 && (
          <div style={{ marginBottom: '80px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0499ff', marginBottom: '50px' }}>Tour Itinerary</h2>
            <div style={{ maxWidth: '900px' }}>
              {tour.itineraries.map((item: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '30px', marginBottom: '50px', position: 'relative' }}>
                  {/* Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 80px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: '#0066cc',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      Day {item.day}
                    </div>
                    {idx < tour.itineraries.length - 1 && (
                      <div style={{ width: '2px', height: '150px', background: '#ddd', margin: '15px 0' }}></div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: '8px', paddingBottom: '10px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0499ff', margin: '0 0 8px 0' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#999', margin: '0 0 12px 0', fontWeight: 500 }}>
                      ðŸ“ {item.location} â€¢ ðŸ“… {item.date}
                    </p>
                    <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7, margin: '0 0 15px 0' }}>
                      {item.description}
                    </p>
                    {item.images && (Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]')).length > 0 && (
                      <img src={(Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]'))[0]} alt={item.title} style={{
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                        height: '200px',
                        border: '1px solid #f0f0f0'
                      }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HIGHLIGHTS SECTION (Detailed) */}
        {tour.highlights && tour.highlights.length > 0 && (
          <div style={{ marginBottom: '80px', paddingBottom: '40px', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0499ff', marginBottom: '30px' }}>Tour Highlights</h2>
            <ul style={{ fontSize: '15px', color: '#555', lineHeight: 2, paddingLeft: '25px', maxWidth: '800px' }}>
              {tour.highlights.map((highlight: any, idx: number) => (
                <li key={idx} style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#ff6b35', fontWeight: 700 }}>â—</span> {highlight.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* INCLUSIONS & EXCLUSIONS */}
        {tour.terms_conditions && tour.terms_conditions.length > 0 && (
          <div style={{ marginBottom: '80px', paddingBottom: '40px', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0499ff', marginBottom: '35px' }}>Package Includes & Excludes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1000px' }}>
              {tour.terms_conditions.map((term: any, idx: number) => (
                <div key={idx}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: term.type === 'package_includes' ? '#28a745' : '#c0392b',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {term.type === 'package_includes' ? 'âœ“' : 'âœ—'} {term.type === 'package_includes' ? 'Includes' : 'Does Not Include'}
                  </h3>
                  <ul style={{ fontSize: '14px', color: '#555', lineHeight: 1.9, paddingLeft: '20px', margin: 0 }}>
                    {term.policy.split('\n').map((item: string, i: number) => (
                      item.trim() && <li key={i}>{item.trim()}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DESTINATIONS */}
        {tour.key_destinations && tour.key_destinations.length > 0 && (
          <div style={{ marginBottom: '80px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0499ff', marginBottom: '40px' }}>Key Destinations</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px' }}>
              {tour.key_destinations.map((dest: any, idx: number) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    margin: '0 auto 20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,.1)',
                    border: '4px solid #fff',
                    background: 'linear-gradient(135deg, #ff6b35, #ffb84d)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '50px',
                    color: '#fff'
                  }}>
                    ðŸ“
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0499ff', margin: '0 0 6px 0' }}>
                    {dest.destination_name}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                    ðŸ“ {dest.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY */}
        {(tour.feature_image || (tour.itineraries && tour.itineraries.some((i: any) => i.images && (Array.isArray(i.images) ? i.images.length > 0 : JSON.parse(i.images || '[]').length > 0)))) && (
          <div style={{ marginTop: '80px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0499ff', marginBottom: '40px' }}>Photo Gallery</h2>
            {tour.feature_image && (
              <img src={tour.feature_image} alt={tour.tour_title} style={{
                width: '100%',
                borderRadius: '8px',
                marginBottom: '25px',
                maxHeight: '500px',
                objectFit: 'cover'
              }} />
            )}
            {tour.itineraries && tour.itineraries.some((i: any) => i.images && (Array.isArray(i.images) ? i.images.length > 0 : JSON.parse(i.images || '[]').length > 0)) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {tour.itineraries.map((item: any, idx: number) => {
                  const images = Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]');
                  return images.length > 0 && (
                    <img key={idx} src={images[0]} alt={item.title} style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }} />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

