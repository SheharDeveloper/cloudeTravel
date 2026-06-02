import { useState, useEffect } from 'react';
import DatePicker from '@/components/DatePicker';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { createTour } from '@/services/tourService';

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
    packageIncludes: string;    // What's included
    packageExcludes: string;    // What's not included
  };
}

const steps = [
  { id: 'basic', label: 'Basic Information', icon: '1' },
  { id: 'highlights', label: 'Highlights', icon: '2' },
  { id: 'itinerary', label: 'Itinerary', icon: '3' },
  { id: 'destinations', label: 'Key Destination', icon: '4' },
  { id: 'terms', label: 'T&C', icon: '5' },
];

export default function CreateTour() {
  const [currentStep, setCurrentStep] = useState('basic');
  // State for tracking loading and error during form submission
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    basic: {
      tourTitle: '',
      heroTitle: '',
      heroSubtitle: '',
      shortDescription: '',
      fullDescription: '',
      country: 'United Kingdom',  // Default value
      city: '',
      duration: '',
      startDate: '',
      endDate: '',
      bookingPrice: '',
      featuredImage: null,
      bannerImage: null,
      status: 'active',  // 'active', 'inactive', or 'draft'
    },
    highlights: [],
    itineraries: [],
    destinations: [],
    termsConditions: {
      packageIncludes: '',
      packageExcludes: '',
    },
  });

  // Monitor date field changes for debugging
  useEffect(() => {
    console.log('Form data updated - Start Date:', formData.basic.startDate, 'End Date:', formData.basic.endDate);
  }, [formData.basic.startDate, formData.basic.endDate]);

  // Prevent date picker library from interfering with native date inputs
  useEffect(() => {
    const startDateInput = document.querySelector('input[data-testid="start-date-input"]') as HTMLInputElement;
    const endDateInput = document.querySelector('input[data-testid="end-date-input"]') as HTMLInputElement;

    if (startDateInput && endDateInput) {
      // Remove any date picker library attributes
      startDateInput.removeAttribute('data-date-format');
      endDateInput.removeAttribute('data-date-format');
      startDateInput.removeAttribute('readonly');
      endDateInput.removeAttribute('readonly');

      // Close any open calendar when date is selected
      const closeCalendar = (e: Event) => {
        const input = e.target as HTMLInputElement;
        // Blur to close any picker
        setTimeout(() => input.blur(), 100);
        // Close any external calendar popup
        document.querySelectorAll('[class*="calendar"]').forEach(cal => {
          (cal as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('[class*="picker"]').forEach(picker => {
          (picker as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('[class*="datepicker"]').forEach(picker => {
          (picker as HTMLElement).style.display = 'none';
        });
      };

      startDateInput.addEventListener('change', closeCalendar);
      endDateInput.addEventListener('change', closeCalendar);

      // Close picker when clicking outside
      const closeOnClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('input[type="date"]')) {
          document.querySelectorAll('[class*="calendar"]').forEach(cal => {
            (cal as HTMLElement).style.display = 'none';
          });
          document.querySelectorAll('[class*="picker"]').forEach(picker => {
            (picker as HTMLElement).style.display = 'none';
          });
          document.querySelectorAll('[class*="datepicker"]').forEach(picker => {
            (picker as HTMLElement).style.display = 'none';
          });
        }
      };

      document.addEventListener('click', closeOnClickOutside);

      return () => {
        startDateInput.removeEventListener('change', closeCalendar);
        endDateInput.removeEventListener('change', closeCalendar);
        document.removeEventListener('click', closeOnClickOutside);
      };
    }
  }, []);

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

  /**
   * Handle tour form submission
   * Validates form data and calls API to create or update tour
   * Redirects to tours list on success
   */
  const publishTour = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Call API service to create tour with all related data
      const response = await createTour(formData);

      if (response.success) {
        setSuccess('Tour created successfully! Redirecting...');
        // Redirect to tours list after 1.5 seconds
        setTimeout(() => {
          window.location.href = '/admin/tours';
        }, 1500);
      } else {
        setError(response.message || 'Failed to create tour');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the tour');
      console.error('Tour creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
        {/* Display error message if submission fails */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <i className="fa fa-exclamation-circle me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Display success message when tour is created */}
        {success && (
          <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
            <i className="fa fa-check-circle me-2"></i>
            {success}
          </div>
        )}

        <div className="page-title mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li><h1>Add New Tour</h1></li>
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
              <li className="breadcrumb-item active" aria-current="page">Add New Tour</li>
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
                    border: '1px solid #ddd',
                    background: currentStep === step.id ? '#003d82' : '#fff',
                    color: currentStep === step.id ? '#fff' : '#666',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s',
                  }}
                >
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: currentStep === step.id ? 'rgba(255,255,255,.2)' : '#f0f0f0',
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
            {currentStep === 'basic' && <BasicInformationStep formData={formData} setFormData={setFormData} />}

            {/* Highlights Step */}
            {currentStep === 'highlights' && <HighlightsStep formData={formData} setFormData={setFormData} />}

            {/* Itinerary Step */}
            {currentStep === 'itinerary' && <ItineraryStep formData={formData} setFormData={setFormData} />}

            {/* Destinations Step */}
            {currentStep === 'destinations' && <DestinationsStep formData={formData} setFormData={setFormData} />}

            {/* Terms & Conditions Step */}
            {currentStep === 'terms' && <TermsConditionsStep formData={formData} setFormData={setFormData} />}

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
                    Save & Next
                  </button>
                )}
                {currentStep === 'terms' && (
                  <button
                    className="btn btn-success"
                    onClick={publishTour}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-check me-2"></i>
                        Publish Tour
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

// ===== STEP COMPONENTS =====

function BasicInformationStep({ formData, setFormData }: any) {
  const updateBasic = (field: string, value: any) => {
    setFormData({
      ...formData,
      basic: { ...formData.basic, [field]: value }
    });
  };

  const handleImageChange = (field: string, file: File | null) => {
    updateBasic(field, file);
  };

  return (
    <div className="card">
      <div className="card-header border-0 d-flex align-items-center justify-content-between">
        <div>
          <h5 className="card-title mb-0">Basic Information</h5>
          <small style={{ color: '#999' }}>Add basic details of yatra</small>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Left Column - Form Fields */}
          <div className="col-md-6">
            {/* Tour Title */}
            <div className="mb-3">
              <label className="form-label fw-bold">Tour Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Beautiful Panj Takht Yatra Nov 2026"
                value={formData.basic.tourTitle}
                onChange={(e) => updateBasic('tourTitle', e.target.value)}
              />
            </div>

            {/* Hero Title */}
            <div className="mb-3">
              <label className="form-label fw-bold">Hero Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Soulful panj-takht-yatra-nov-2026"
                value={formData.basic.heroTitle}
                onChange={(e) => updateBasic('heroTitle', e.target.value)}
              />
            </div>

            {/* Hero Subtitle */}
            <div className="mb-3">
              <label className="form-label fw-bold">Hero Subtitle</label>
              <input
                type="text"
                className="form-control"
                placeholder="11th Nov - 22nd Nov 2026 (12 Days)"
                value={formData.basic.heroSubtitle}
                onChange={(e) => updateBasic('heroSubtitle', e.target.value)}
              />
            </div>

            {/* Short Description */}
            <div className="mb-3">
              <label className="form-label fw-bold">Short Description</label>
              <textarea
                className="form-control"
                placeholder="Early Booking Price with Flights from London"
                rows={2}
                value={formData.basic.shortDescription}
                onChange={(e) => updateBasic('shortDescription', e.target.value)}
              ></textarea>
            </div>

            {/* Country & City in Row */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Country *</label>
                <select
                  className="form-control"
                  value={formData.basic.country}
                  onChange={(e) => updateBasic('country', e.target.value)}
                >
                  <option value="">United Kingdom</option>
                  <option value="India">India</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Malaysia">Malaysia</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">City *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="London"
                  value={formData.basic.city}
                  onChange={(e) => updateBasic('city', e.target.value)}
                />
              </div>
            </div>

            {/* Duration & Start Date */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Duration (Days) *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="12"
                  value={formData.basic.duration}
                  onChange={(e) => updateBasic('duration', e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <DatePicker
                  label="Start Date *"
                  value={formData.basic.startDate}
                  onChange={(date) => {
                    setFormData((prev: FormData) => ({
                      ...prev,
                      basic: { ...prev.basic, startDate: date }
                    }));
                  }}
                />
              </div>
            </div>

            {/* End Date & Status */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <DatePicker
                  label="End Date *"
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

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Status</label>
                <select
                  className="form-control"
                  value={formData.basic.status}
                  onChange={(e) => updateBasic('status', e.target.value as 'active' | 'inactive' | 'draft')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Booking Price Text */}
            <div className="mb-3">
              <label className="form-label fw-bold">Early Booking Price Text</label>
              <input
                type="text"
                className="form-control"
                placeholder="Early Booking Price with Flights from London"
                value={formData.basic.bookingPrice}
                onChange={(e) => updateBasic('bookingPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="col-md-6">
            {/* Featured Image */}
            <div className="mb-4">
              <label className="form-label fw-bold">Featured Image *</label>
              <div style={{
                border: '2px dashed #ddd',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#f9f9f9',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {formData.basic.featuredImage ? (
                  <div style={{ width: '100%' }}>
                    <img
                      src={URL.createObjectURL(formData.basic.featuredImage)}
                      alt="Featured Preview"
                      style={{ maxWidth: '100%', maxHeight: '160px', marginBottom: '10px', borderRadius: '4px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => document.getElementById('featuredImage')?.click()}
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <i className="fa fa-image" style={{ fontSize: '40px', color: '#999', marginBottom: '10px' }}></i>
                    <p style={{ marginBottom: '8px', fontSize: '12px' }}>Upload image</p>
                    <small style={{ color: '#999' }}>PNG, JPG up to 10MB</small>
                  </div>
                )}
                <input
                  id="featuredImage"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageChange('featuredImage', e.target.files?.[0] || null)}
                />
              </div>
            </div>

            {/* Banner Image */}
            <div className="mb-4">
              <label className="form-label fw-bold">Banner Image *</label>
              <div style={{
                border: '2px dashed #ddd',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#f9f9f9',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {formData.basic.bannerImage ? (
                  <div style={{ width: '100%' }}>
                    <img
                      src={URL.createObjectURL(formData.basic.bannerImage)}
                      alt="Banner Preview"
                      style={{ maxWidth: '100%', maxHeight: '160px', marginBottom: '10px', borderRadius: '4px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => document.getElementById('bannerImage')?.click()}
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <i className="fa fa-image" style={{ fontSize: '40px', color: '#999', marginBottom: '10px' }}></i>
                    <p style={{ marginBottom: '8px', fontSize: '12px' }}>Upload image</p>
                    <small style={{ color: '#999' }}>PNG, JPG up to 10MB</small>
                  </div>
                )}
                <input
                  id="bannerImage"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageChange('bannerImage', e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="row mt-4">
          <div className="col-md-12 mb-3">
            <label className="form-label fw-bold">Full Description *</label>
            <textarea
              className="form-control"
              placeholder="Enter detailed description"
              rows={4}
              value={formData.basic.fullDescription}
              onChange={(e) => updateBasic('fullDescription', e.target.value)}
            ></textarea>
          </div>
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

  const icons = [
    { value: 'fa-heart', label: 'Heart' },
    { value: 'fa-shield', label: 'Shield' },
    { value: 'fa-crown', label: 'Crown' },
    { value: 'fa-gem', label: 'Gem' },
    { value: 'fa-camera', label: 'Camera' },
    { value: 'fa-mountain', label: 'Mountain' },
    { value: 'fa-water', label: 'Water' },
    { value: 'fa-users', label: 'Users' },
    { value: 'fa-utensils', label: 'Utensils' },
    { value: 'fa-bed', label: 'Bed' },
    { value: 'fa-car', label: 'Car' },
    { value: 'fa-star', label: 'Star' },
  ];

  return (
    <div className="card">
      <div className="card-header border-0 d-flex align-items-center justify-content-between">
        <div>
          <h5 className="card-title mb-0">Highlights</h5>
          <small style={{ color: '#999' }}>Add yatra highlights</small>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={addHighlight}
        >
          <i className="fa fa-plus me-1"></i> Add New Highlight
        </button>
      </div>

      <div className="card-body p-0">
        {formData.highlights.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <i className="fa fa-inbox" style={{ fontSize: '40px', marginBottom: '15px', display: 'block' }}></i>
            <p>No highlights added yet. Click "Add New Highlight" to add one.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }}>Icon</th>
                  <th>Title *</th>
                  <th>Description</th>
                  <th style={{ width: '100px' }}>Sort Order</th>
                  <th style={{ width: '60px', textAlign: 'right' }}></th>
                </tr>
              </thead>
              <tbody>
                {formData.highlights.map((highlight: any) => (
                  <tr key={highlight.id}>
                    <td>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: '#e8f1ff',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}>
                        <select
                          value={highlight.icon}
                          onChange={(e) => updateHighlight(highlight.id, 'icon', e.target.value)}
                          style={{
                            position: 'absolute',
                            opacity: 0,
                            width: '50px',
                            height: '50px',
                            cursor: 'pointer',
                          }}
                        >
                          {icons.map(icon => (
                            <option key={icon.value} value={icon.value}>{icon.label}</option>
                          ))}
                        </select>
                        <i className={`fa ${highlight.icon}`} style={{ fontSize: '24px', color: '#003d82' }}></i>
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g., Visit 5 Panj Takht Sahib"
                        value={highlight.title}
                        onChange={(e) => updateHighlight(highlight.id, 'title', e.target.value)}
                        style={{ border: 'none', padding: 0, background: 'transparent' }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Description"
                        value={highlight.description}
                        onChange={(e) => updateHighlight(highlight.id, 'description', e.target.value)}
                        style={{ border: 'none', padding: 0, background: 'transparent' }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={highlight.sortOrder}
                        onChange={(e) => updateHighlight(highlight.id, 'sortOrder', parseInt(e.target.value))}
                        style={{ border: 'none', padding: 0, background: 'transparent', textAlign: 'center' }}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeHighlight(highlight.id)}
                        title="Delete"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        <div>
          <h5 className="card-title mb-0">Itinerary</h5>
          <small style={{ color: '#999' }}>Add itinerary days</small>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={addItinerary}
        >
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
                    <div style={{
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
                    onClick={() => document.getElementById(`itinerary-${item.id}`)?.click()}
                    >
                      {item.image ? (
                        <div style={{ width: '100%' }}>
                          <img
                            src={URL.createObjectURL(item.image)}
                            alt="Itinerary Preview"
                            style={{ maxWidth: '100%', maxHeight: '220px', marginBottom: '10px', borderRadius: '4px' }}
                          />
                        </div>
                      ) : (
                        <div>
                          <i className="fa fa-image" style={{ fontSize: '40px', color: '#999', marginBottom: '10px' }}></i>
                          <p style={{ fontSize: '12px', marginBottom: '5px', color: '#666' }}>Click to upload image</p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm w-100 mb-2"
                      onClick={() => document.getElementById(`itinerary-${item.id}`)?.click()}
                    >
                      {item.image ? 'Change Image' : 'Upload Image'}
                    </button>
                    <input
                      id={`itinerary-${item.id}`}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => updateItinerary(item.id, 'image', e.target.files?.[0] || null)}
                    />

                    <small style={{ color: '#999', display: 'block', marginBottom: '15px' }}>
                      Recommended size 800x500px
                    </small>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Sort Order</label>
                        <input
                          type="number"
                          className="form-control"
                          value={item.dayNumber}
                          onChange={(e) => updateItinerary(item.id, 'dayNumber', parseInt(e.target.value))}
                        />
                      </div>

                      <div className="col-md-6 mb-3 d-flex align-items-end">
                        <button
                          type="button"
                          className="btn btn-danger w-100"
                          onClick={() => removeItinerary(item.id)}
                          title="Delete"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
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
        <div>
          <h5 className="card-title mb-0">Key Destination</h5>
          <small style={{ color: '#999' }}>Add key destinations</small>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={addDestination}
        >
          <i className="fa fa-plus me-1"></i> Add New Destination
        </button>
      </div>
      <div className="card-body">
        {formData.destinations.map((destination: any) => (
          <div key={destination.id} className="row mb-3">
            <div className="col-md-3">
              <div style={{
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
              }}>
                {destination.image ? (
                  <div>
                    <img src={URL.createObjectURL(destination.image)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '120px', marginBottom: '10px' }} />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => document.getElementById(`dest-${destination.id}`)?.click()}
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <i className="fa fa-cloud-upload-alt" style={{ fontSize: '24px', color: '#999', marginBottom: '10px' }}></i>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => document.getElementById(`dest-${destination.id}`)?.click()}
                    >
                      Upload Image
                    </button>
                  </div>
                )}
                <input
                  id={`dest-${destination.id}`}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => updateDestination(destination.id, 'image', e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="col-md-9">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label className="form-label fw-bold form-label-sm">Destination Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Palace Sikh Gurudwara"
                        value={destination.destinationName}
                        onChange={(e) => updateDestination(destination.id, 'destinationName', e.target.value)}
                      />
                    </div>

                    <div className="col-md-6 mb-2">
                      <label className="form-label fw-bold form-label-sm">Location</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Location"
                        value={destination.location}
                        onChange={(e) => updateDestination(destination.id, 'location', e.target.value)}
                      />
                    </div>

                    <div className="col-md-12 mb-2">
                      <label className="form-label fw-bold form-label-sm">Description</label>
                      <textarea
                        className="form-control form-control-sm"
                        placeholder="Destination description"
                        rows={2}
                        value={destination.description}
                        onChange={(e) => updateDestination(destination.id, 'description', e.target.value)}
                      ></textarea>
                    </div>

                    <div className="col-md-12">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeDestination(destination.id)}
                      >
                        <i className="fa fa-trash me-1"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {formData.destinations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
            <i className="fa fa-inbox" style={{ fontSize: '40px', marginBottom: '15px', display: 'block' }}></i>
            <p>No destinations added yet. Click "Add New Destination" to add one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TermsConditionsStep({ formData, setFormData }: any) {
  const updateTC = (field: string, value: string) => {
    setFormData({
      ...formData,
      termsConditions: { ...formData.termsConditions, [field]: value }
    });
  };

  return (
    <div className="card">
      <div className="card-header border-0">
        <div>
          <h5 className="card-title mb-0">Terms & Conditions</h5>
          <small style={{ color: '#999' }}>Add tour terms and conditions</small>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <label className="form-label fw-bold">Package Includes *</label>
          <textarea
            className="form-control"
            placeholder="e.g., Accommodation, meals, tour guide, airport transfers..."
            rows={4}
            value={formData.termsConditions.packageIncludes}
            onChange={(e) => updateTC('packageIncludes', e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Package Does Not Include *</label>
          <textarea
            className="form-control"
            placeholder="e.g., Personal expenses, travel insurance, visa fees..."
            rows={4}
            value={formData.termsConditions.packageExcludes}
            onChange={(e) => updateTC('packageExcludes', e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
