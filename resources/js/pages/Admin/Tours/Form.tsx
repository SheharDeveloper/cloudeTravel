import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface TourFormProps {
    tour?: any;
    isEdit?: boolean;
}

/**
 * Tour Form Component - Reusable form for creating/editing tours
 */
export default function TourForm({ tour, isEdit = false }: TourFormProps) {
    const [formData, setFormData] = useState({
        name: tour?.name || '',
        duration: tour?.duration || '',
        subtitle: tour?.subtitle || '',
        description: tour?.description || '',
        price: tour?.price || '',
        location: tour?.location || '',
        image: tour?.image || '',
        highlights: tour?.highlights || [],
        itinerary: tour?.itinerary || [],
        package_includes: tour?.package_includes || [],
        package_excludes: tour?.package_excludes || [],
        terms_conditions: tour?.terms_conditions || '',
    });

    const [newHighlight, setNewHighlight] = useState('');
    const [newItinerary, setNewItinerary] = useState({ day: '', description: '' });
    const [newInclude, setNewInclude] = useState('');
    const [newExclude, setNewExclude] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handle form input changes
     */
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    /**
     * Add highlight to list
     */
    const addHighlight = () => {
        if (newHighlight.trim()) {
            setFormData(prev => ({
                ...prev,
                highlights: [...(prev.highlights || []), newHighlight]
            }));
            setNewHighlight('');
        }
    };

    /**
     * Remove highlight from list
     */
    const removeHighlight = (index: number) => {
        setFormData(prev => ({
            ...prev,
            highlights: prev.highlights.filter((_: any, i: number) => i !== index)
        }));
    };

    /**
     * Add itinerary item
     */
    const addItinerary = () => {
        if (newItinerary.day.trim() && newItinerary.description.trim()) {
            setFormData(prev => ({
                ...prev,
                itinerary: [...(prev.itinerary || []), newItinerary]
            }));
            setNewItinerary({ day: '', description: '' });
        }
    };

    /**
     * Remove itinerary item
     */
    const removeItinerary = (index: number) => {
        setFormData(prev => ({
            ...prev,
            itinerary: prev.itinerary.filter((_: any, i: number) => i !== index)
        }));
    };

    /**
     * Add package include item
     */
    const addInclude = () => {
        if (newInclude.trim()) {
            setFormData(prev => ({
                ...prev,
                package_includes: [...(prev.package_includes || []), newInclude]
            }));
            setNewInclude('');
        }
    };

    /**
     * Remove package include item
     */
    const removeInclude = (index: number) => {
        setFormData(prev => ({
            ...prev,
            package_includes: prev.package_includes.filter((_: any, i: number) => i !== index)
        }));
    };

    /**
     * Add package exclude item
     */
    const addExclude = () => {
        if (newExclude.trim()) {
            setFormData(prev => ({
                ...prev,
                package_excludes: [...(prev.package_excludes || []), newExclude]
            }));
            setNewExclude('');
        }
    };

    /**
     * Remove package exclude item
     */
    const removeExclude = (index: number) => {
        setFormData(prev => ({
            ...prev,
            package_excludes: prev.package_excludes.filter((_: any, i: number) => i !== index)
        }));
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = isEdit ? `/admin/tours/${tour.id}` : '/admin/tours';
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(isEdit ? 'Tour updated successfully!' : 'Tour created successfully!');
                // Redirect after success
                setTimeout(() => {
                    window.location.href = '/admin/tours';
                }, 1500);
            } else {
                toast.error(data.error || 'Error saving tour');
            }
        } catch (error) {
            toast.error('Error saving tour');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#003d82', marginBottom: '30px' }}>
                {isEdit ? 'Edit Tour' : 'Create New Tour'}
            </h1>

            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
                {/* BASIC INFO */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#003d82', marginBottom: '15px' }}>Basic Information</h3>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 700, color: '#003d82', marginBottom: '5px', fontSize: '13px' }}>Tour Name *</label>
                        <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="e.g., Singapore & Thailand Sep 2026" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 700, color: '#003d82', marginBottom: '5px', fontSize: '13px' }}>Duration *</label>
                            <input type="text" value={formData.duration} onChange={(e) => handleInputChange('duration', e.target.value)} placeholder="e.g., 7 Days" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 700, color: '#003d82', marginBottom: '5px', fontSize: '13px' }}>Price</label>
                            <input type="number" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} placeholder="e.g., 1299" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 700, color: '#003d82', marginBottom: '5px', fontSize: '13px' }}>Subtitle *</label>
                        <input type="text" value={formData.subtitle} onChange={(e) => handleInputChange('subtitle', e.target.value)} placeholder="e.g., September 2026 (24th Sep - 01st Oct 2026)" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} required />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 700, color: '#003d82', marginBottom: '5px', fontSize: '13px' }}>Location</label>
                        <input type="text" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="e.g., Singapore, Thailand" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 700, color: '#003d82', marginBottom: '5px', fontSize: '13px' }}>Image URL</label>
                        <input type="text" value={formData.image} onChange={(e) => handleInputChange('image', e.target.value)} placeholder="e.g., https://example.com/image.jpg" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 700, color: '#003d82', marginBottom: '5px', fontSize: '13px' }}>Description *</label>
                        <textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Detailed tour description..." style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', minHeight: '120px', fontFamily: "'Open Sans', sans-serif" }} required></textarea>
                    </div>
                </div>

                {/* HIGHLIGHTS */}
                <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#003d82', marginBottom: '15px' }}>Highlights</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <input type="text" value={newHighlight} onChange={(e) => setNewHighlight(e.target.value)} placeholder="Add a highlight..." style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }} />
                        <button type="button" onClick={addHighlight} style={{ background: '#003d82', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
                    </div>
                    <div>
                        {(formData.highlights || []).map((highlight: string, idx: number) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f9f9f9', borderRadius: '4px', marginBottom: '8px', fontSize: '13px' }}>
                                <span>• {highlight}</span>
                                <button type="button" onClick={() => removeHighlight(idx)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontWeight: 700 }}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ITINERARY */}
                <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#003d82', marginBottom: '15px' }}>Itinerary</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 80px', gap: '10px', marginBottom: '15px' }}>
                        <input type="text" value={newItinerary.day} onChange={(e) => setNewItinerary({ ...newItinerary, day: e.target.value })} placeholder="Day 1" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }} />
                        <input type="text" value={newItinerary.description} onChange={(e) => setNewItinerary({ ...newItinerary, description: e.target.value })} placeholder="Itinerary details..." style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }} />
                        <button type="button" onClick={addItinerary} style={{ background: '#003d82', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
                    </div>
                    <div>
                        {(formData.itinerary || []).map((item: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f9f9f9', borderRadius: '4px', marginBottom: '8px', fontSize: '13px' }}>
                                <div><strong>{item.day}:</strong> {item.description}</div>
                                <button type="button" onClick={() => removeItinerary(idx)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontWeight: 700 }}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PACKAGE INCLUDES */}
                <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#003d82', marginBottom: '15px' }}>Package Includes</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <input type="text" value={newInclude} onChange={(e) => setNewInclude(e.target.value)} placeholder="Add what's included..." style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }} />
                        <button type="button" onClick={addInclude} style={{ background: '#003d82', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
                    </div>
                    <div>
                        {(formData.package_includes || []).map((include: string, idx: number) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f9f9f9', borderRadius: '4px', marginBottom: '8px', fontSize: '13px' }}>
                                <span>✓ {include}</span>
                                <button type="button" onClick={() => removeInclude(idx)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontWeight: 700 }}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PACKAGE EXCLUDES */}
                <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#003d82', marginBottom: '15px' }}>Package Excludes</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <input type="text" value={newExclude} onChange={(e) => setNewExclude(e.target.value)} placeholder="Add what's not included..." style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }} />
                        <button type="button" onClick={addExclude} style={{ background: '#003d82', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
                    </div>
                    <div>
                        {(formData.package_excludes || []).map((exclude: string, idx: number) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f9f9f9', borderRadius: '4px', marginBottom: '8px', fontSize: '13px' }}>
                                <span>✗ {exclude}</span>
                                <button type="button" onClick={() => removeExclude(idx)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontWeight: 700 }}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TERMS & CONDITIONS */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#003d82', marginBottom: '15px' }}>Terms & Conditions</h3>
                    <textarea value={formData.terms_conditions} onChange={(e) => handleInputChange('terms_conditions', e.target.value)} placeholder="Terms and conditions..." style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', minHeight: '100px', fontFamily: "'Open Sans', sans-serif" }}></textarea>
                </div>

                {/* SUBMIT BUTTON */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={isLoading} style={{ background: '#003d82', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? 'Saving...' : isEdit ? 'Update Tour' : 'Create Tour'}
                    </button>
                    <a href="/admin/tours" style={{ background: '#ddd', color: '#333', border: 'none', padding: '12px 30px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        Cancel
                    </a>
                </div>
            </form>

            <Toaster position="top-right" />
        </div>
    );
}
