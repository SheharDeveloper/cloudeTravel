import { useState, useEffect } from 'react';
import DatePicker from '@/components/DatePicker';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { getTour, updateTour } from '@/services/tourService';

interface FormData {
  basic: {
    tourTitle: string;
    heroTitle: string;
    heroSubtitle: string;
    shortDescription: string;
    fullDescription: string;
    country: string;
    city: string;
    duration: string;
    startDate: string;
    endDate: string;
    bookingPrice: string;
    featuredImage: File | null;
    bannerImage: File | null;
    status: 'active' | 'inactive' | 'draft';
  };
  highlights: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
    sortOrder: number;
  }>;
  itineraries: Array<{
    id: string;
    dayNumber: number;
    date: string;
    title: string;
    location: string;
    description: string;
    image: File | null;
  }>;
  destinations: Array<{
    id: string;
    destinationName: string;
    location: string;
    description: string;
    image: File | null;
    sortOrder: number;
  }>;
  termsConditions: {
    packageIncludes: string;
    packageExcludes: string;
  };
}

const steps = [
  { id: 'basic', label: 'Basic Information', icon: '1' },
  { id: 'highlights', label: 'Highlights', icon: '2' },
  { id: 'itinerary', label: 'Itinerary', icon: '3' },
  { id: 'destinations', label: 'Key Destination', icon: '4' },
  { id: 'terms', label: 'T&C', icon: '5' },
];

export default function EditTour() {
  const id = window.location.pathname.split('/')[3];
  const [currentStep, setCurrentStep] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    basic: {
      tourTitle: '',
      heroTitle: '',
      heroSubtitle: '',
      shortDescription: '',
      fullDescription: '',
      country: 'United Kingdom',
      city: '',
      duration: '',
      startDate: '',
      endDate: '',
      bookingPrice: '',
      featuredImage: null,
      bannerImage: null,
      status: 'active',
    },
    highlights: [],
    itineraries: [],
    destinations: [],
    termsConditions: {
      packageIncludes: '',
      packageExcludes: '',
    },
  });

  // Load tour data from API on mount
  useEffect(() => {
    const loadTourData = async () => {
      try {
        setPageLoading(true);
        const response = await getTour(parseInt(id!));

        if (response.success) {
          const tour = response.data;

          setFormData({
            basic: {
              tourTitle: tour.tour_title || '',
              heroTitle: tour.hero_title || '',
              heroSubtitle: tour.hero_subtitle || '',
              shortDescription: tour.short_description || '',
              fullDescription: tour.full_description || '',
              country: tour.country || 'United Kingdom',
              city: tour.city || '',
              duration: tour.duration_days?.toString() || '',
              startDate: tour.start_date || '',
              endDate: tour.end_date || '',
              bookingPrice: tour.early_booking_price_text || '',
              featuredImage: null,
              bannerImage: null,
              status: tour.status || 'active',
            },
            highlights: tour.highlights || [],
            itineraries: tour.itineraries || [],
            destinations: tour.key_destinations || [],
            termsConditions: {
              packageIncludes: tour.terms_conditions?.[0]?.policy || '',
              packageExcludes: tour.terms_conditions?.[1]?.policy || '',
            },
          });
        } else {
          setError(response.message || 'Failed to load tour');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading tour');
        console.error('Tour load error:', err);
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      loadTourData();
    }
  }, [id]);

  const goToStep = (stepId: string) => {
    setCurrentStep(stepId);
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const updateTourData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const response = await updateTour(parseInt(id!), formData);

      if (response.success) {
        setSuccess('Tour updated successfully! Redirecting...');

        setTimeout(() => {
          window.location.href = '/admin/tours';
        }, 1500);
      } else {
        setError(response.message || 'Failed to update tour');
      }
    } catch (err: any) {
      if (err.errors) {
        const errorMessages = Object.values(err.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(err.message || 'Failed to update tour');
      }

      console.error('Tour update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <ProtectedRoute>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="fa fa-exclamation-circle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          <i className="fa fa-check-circle me-2"></i>
          {success}
        </div>
      )}

      <div className="page-title mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li><h1>Edit Tour</h1></li>
            <li className="breadcrumb-item">
              <a href="/dashboard">
                <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/admin/tours">Tours</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">Edit Tour</li>
          </ol>
        </nav>
      </div>

      {/* Step Tabs */}
      <div className="card mb-4">
        <div className="card-body">
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: currentStep === step.id ? '2px solid #003d82' : '2px solid #ddd',
                  background: currentStep === step.id ? '#003d82' : '#f9f9f9',
                  color: currentStep === step.id ? '#fff' : '#333',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: currentStep === step.id ? 'rgba(255,255,255,0.3)' : '#ddd',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}>
                  {index + 1}
                </span>
                {step.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="row">
        <div className="col-xl-12">
          {/* Basic Information Step */}
          {currentStep === 'basic' && (
            <BasicInformationStep formData={formData} setFormData={setFormData} />
          )}

          {/* Highlights Step */}
          {currentStep === 'highlights' && (
            <HighlightsStep formData={formData} setFormData={setFormData} />
          )}

          {/* Itinerary Step */}
          {currentStep === 'itinerary' && (
            <ItineraryStep formData={formData} setFormData={setFormData} />
          )}

          {/* Destinations Step */}
          {currentStep === 'destinations' && (
            <DestinationsStep formData={formData} setFormData={setFormData} />
          )}

          {/* Terms & Conditions Step */}
          {currentStep === 'terms' && (
            <TermsConditionsStep formData={formData} setFormData={setFormData} />
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              onClick={prevStep}
              className="btn btn-secondary"
              disabled={currentStep === 'basic'}
            >
              Back
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              {currentStep !== 'terms' && (
                <button
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  Next
                </button>
              )}

              {currentStep === 'terms' && (
                <button
                  onClick={updateTourData}
                  className="btn btn-success"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check me-2"></i>
                      Update Tour
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function BasicInformationStep({ formData, setFormData }: any) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">Basic Information</h5>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Tour Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., London City Tour"
              value={formData.basic.tourTitle}
              onChange={(e) =>
                setFormData((prev: FormData) => ({
                  ...prev,
                  basic: { ...prev.basic, tourTitle: e.target.value }
                }))
              }
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Hero Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Hero title for banner"
              value={formData.basic.heroTitle}
              onChange={(e) =>
                setFormData((prev: FormData) => ({
                  ...prev,
                  basic: { ...prev.basic, heroTitle: e.target.value }
                }))
              }
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Hero Subtitle</label>
          <input
            type="text"
            className="form-control"
            placeholder="Subtitle for hero banner"
            value={formData.basic.heroSubtitle}
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                basic: { ...prev.basic, heroSubtitle: e.target.value }
              }))
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Short Description *</label>
          <textarea
            className="form-control"
            placeholder="Short description for listing"
            rows={2}
            value={formData.basic.shortDescription}
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                basic: { ...prev.basic, shortDescription: e.target.value }
              }))
            }
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Full Description *</label>
          <textarea
            className="form-control"
            placeholder="Detailed description"
            rows={4}
            value={formData.basic.fullDescription}
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                basic: { ...prev.basic, fullDescription: e.target.value }
              }))
            }
          ></textarea>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Country *</label>
            <input
              type="text"
              className="form-control"
              value={formData.basic.country}
              onChange={(e) =>
                setFormData((prev: FormData) => ({
                  ...prev,
                  basic: { ...prev.basic, country: e.target.value }
                }))
              }
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">City *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., London"
              value={formData.basic.city}
              onChange={(e) =>
                setFormData((prev: FormData) => ({
                  ...prev,
                  basic: { ...prev.basic, city: e.target.value }
                }))
              }
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Duration (Days) *</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g., 7"
              value={formData.basic.duration}
              onChange={(e) =>
                setFormData((prev: FormData) => ({
                  ...prev,
                  basic: { ...prev.basic, duration: e.target.value }
                }))
              }
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Booking Price Text</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., From £1,999"
              value={formData.basic.bookingPrice}
              onChange={(e) =>
                setFormData((prev: FormData) => ({
                  ...prev,
                  basic: { ...prev.basic, bookingPrice: e.target.value }
                }))
              }
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Start Date *</label>
            <DatePicker
              label=""
              value={formData.basic.startDate}
              onChange={(date) => {

                setFormData((prev: FormData) => ({
                  ...prev,
                  basic: { ...prev.basic, startDate: date }
                }));
              }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">End Date *</label>
            <DatePicker
              label=""
              value={formData.basic.endDate}
              onChange={(date) => {

                setFormData((prev: FormData) => ({
                  ...prev,
                  basic: { ...prev.basic, endDate: date }
                }));
              }}
              minDate={formData.basic.startDate}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Status</label>
          <select
            className="form-control"
            value={formData.basic.status}
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                basic: { ...prev.basic, status: e.target.value as 'active' | 'inactive' | 'draft' }
              }))
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function HighlightsStep({ formData, setFormData }: any) {
  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...formData.highlights, {
        id: Date.now().toString(),
        icon: 'fa-star',
        title: '',
        description: '',
        sortOrder: formData.highlights.length + 1,
      }],
    });
  };

  const removeHighlight = (id: string) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((h: any) => h.id !== id),
    });
  };

  const updateHighlight = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.map((h: any) =>
        h.id === id ? { ...h, [field]: value } : h
      ),
    });
  };

  const icons = ['fa-star', 'fa-map', 'fa-utensils', 'fa-bed', 'fa-camera', 'fa-shield', 'fa-gift', 'fa-check'];

  return (
    <div className="card">
      <div className="card-header border-0 d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0">Highlights</h5>
        <button className="btn btn-primary btn-sm" onClick={addHighlight}>
          <i className="fa fa-plus me-1"></i> Add New Highlight
        </button>
      </div>

      <div className="card-body">
        {formData.highlights.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
            <p>No highlights added yet. Click "Add New Highlight" to add one.</p>
          </div>
        ) : (
          formData.highlights.map((highlight: any) => (
            <div key={highlight.id} className="card mb-3" style={{ border: '1px solid #ddd' }}>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label fw-bold">Icon</label>
                    <select
                      className="form-control form-control-sm"
                      value={highlight.icon}
                      onChange={(e) => updateHighlight(highlight.id, 'icon', e.target.value)}
                    >
                      {icons.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label fw-bold">Title *</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Highlight title"
                      value={highlight.title}
                      onChange={(e) => updateHighlight(highlight.id, 'title', e.target.value)}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <textarea
                      className="form-control form-control-sm"
                      placeholder="Highlight description"
                      rows={1}
                      value={highlight.description}
                      onChange={(e) => updateHighlight(highlight.id, 'description', e.target.value)}
                    ></textarea>
                  </div>

                  <div className="col-md-2 mb-3 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm w-100"
                      onClick={() => removeHighlight(highlight.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ItineraryStep({ formData, setFormData }: any) {
  const addItinerary = () => {
    setFormData({
      ...formData,
      itineraries: [...formData.itineraries, {
        id: Date.now().toString(),
        dayNumber: formData.itineraries.length + 1,
        date: '',
        title: '',
        location: '',
        description: '',
        image: null,
      }],
    });
  };

  const removeItinerary = (id: string) => {
    setFormData({
      ...formData,
      itineraries: formData.itineraries.filter((i: any) => i.id !== id),
    });
  };

  const updateItinerary = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      itineraries: formData.itineraries.map((i: any) =>
        i.id === id ? { ...i, [field]: value } : i
      ),
    });
  };

  return (
    <div className="card">
      <div className="card-header border-0 d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0">Itinerary</h5>
        <button className="btn btn-primary btn-sm" onClick={addItinerary}>
          <i className="fa fa-plus me-1"></i> Add New Day
        </button>
      </div>

      <div className="card-body">
        {formData.itineraries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <i className="fa fa-inbox" style={{ fontSize: '40px', marginBottom: '15px', display: 'block' }}></i>
            <p>No itinerary days added yet. Click "Add New Day" to add one.</p>
          </div>
        ) : (
          formData.itineraries.map((item: any) => (
            <div key={item.id} className="card mb-4" style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
              <div className="card-body">
                <div className="row">
                  {/* Left Column - Form Fields */}
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Day *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={`Day ${item.dayNumber}`}
                          readOnly
                          style={{ background: '#f9f9f9' }}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={item.date}
                          onChange={(e) => updateItinerary(item.id, 'date', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., London Heathrow Departure"
                        value={item.title}
                        onChange={(e) => updateItinerary(item.id, 'title', e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Location *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., London"
                        value={item.location}
                        onChange={(e) => updateItinerary(item.id, 'location', e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Description</label>
                      <textarea
                        className="form-control"
                        placeholder="e.g., London Heathrow Departure"
                        rows={3}
                        value={item.description}
                        onChange={(e) => updateItinerary(item.id, 'description', e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  {/* Right Column - Image */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Image</label>
                    <div
                      onClick={() => document.getElementById(`itinerary-${item.id}`)?.click()}
                      style={{
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        padding: '20px',
                        textAlign: 'center',
                        background: '#f9f9f9',
                        minHeight: '280px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '15px',
                        cursor: 'pointer',
                      }}
                    >
                      <i className="fa fa-cloud-upload" style={{ fontSize: '32px', color: '#999', marginBottom: '10px' }}></i>
                      <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>Click to upload image</p>
                    </div>
                    <input
                      id={`itinerary-${item.id}`}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          updateItinerary(item.id, 'image', e.target.files[0]);
                        }
                      }}
                    />
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm w-100"
                        onClick={() => removeItinerary(item.id)}
                      >
                        <i className="fa fa-trash me-1"></i> Remove Day
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DestinationsStep({ formData, setFormData }: any) {
  const addDestination = () => {
    setFormData({
      ...formData,
      destinations: [...formData.destinations, {
        id: Date.now().toString(),
        destinationName: '',
        location: '',
        description: '',
        image: null,
        sortOrder: formData.destinations.length + 1,
      }],
    });
  };

  const removeDestination = (id: string) => {
    setFormData({
      ...formData,
      destinations: formData.destinations.filter((d: any) => d.id !== id),
    });
  };

  const updateDestination = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      destinations: formData.destinations.map((d: any) =>
        d.id === id ? { ...d, [field]: value } : d
      ),
    });
  };

  return (
    <div className="card">
      <div className="card-header border-0 d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0">Key Destinations</h5>
        <button className="btn btn-primary btn-sm" onClick={addDestination}>
          <i className="fa fa-plus me-1"></i> Add Destination
        </button>
      </div>

      <div className="card-body">
        {formData.destinations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <i className="fa fa-map-marker" style={{ fontSize: '40px', marginBottom: '15px', display: 'block' }}></i>
            <p>No destinations added yet. Click "Add Destination" to add one.</p>
          </div>
        ) : (
          formData.destinations.map((dest: any) => (
            <div key={dest.id} className="card mb-4" style={{ border: '1px solid #ddd' }}>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Destination Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Tower of London"
                        value={dest.destinationName}
                        onChange={(e) => updateDestination(dest.id, 'destinationName', e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., London"
                        value={dest.location}
                        onChange={(e) => updateDestination(dest.id, 'location', e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Description</label>
                      <textarea
                        className="form-control"
                        placeholder="Destination description"
                        rows={3}
                        value={dest.description}
                        onChange={(e) => updateDestination(dest.id, 'description', e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Image</label>
                    <div
                      onClick={() => document.getElementById(`destination-${dest.id}`)?.click()}
                      style={{
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        padding: '20px',
                        textAlign: 'center',
                        background: '#f9f9f9',
                        minHeight: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '15px',
                        cursor: 'pointer',
                      }}
                    >
                      <i className="fa fa-cloud-upload" style={{ fontSize: '32px', color: '#999', marginBottom: '10px' }}></i>
                      <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>Click to upload image</p>
                    </div>
                    <input
                      id={`destination-${dest.id}`}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          updateDestination(dest.id, 'image', e.target.files[0]);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm w-100"
                      onClick={() => removeDestination(dest.id)}
                    >
                      <i className="fa fa-trash me-1"></i> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TermsConditionsStep({ formData, setFormData }: any) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">Terms & Conditions</h5>

        <div className="mb-4">
          <label className="form-label fw-bold">Package Includes *</label>
          <textarea
            className="form-control"
            placeholder="List what's included in the package"
            rows={4}
            value={formData.termsConditions.packageIncludes}
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                termsConditions: { ...prev.termsConditions, packageIncludes: e.target.value }
              }))
            }
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Package Excludes *</label>
          <textarea
            className="form-control"
            placeholder="List what's NOT included in the package"
            rows={4}
            value={formData.termsConditions.packageExcludes}
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                termsConditions: { ...prev.termsConditions, packageExcludes: e.target.value }
              }))
            }
          ></textarea>
        </div>
      </div>
    </div>
  );
}
