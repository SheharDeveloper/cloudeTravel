import { useState } from 'react';
import CalendarDateRangePicker from '@/components/CalendarDateRangePicker';

interface VisaServiceFormProps {
    travelDate?: string;
    tripType?: string;
}

export default function VisaServiceForm({ travelDate: initialTravelDate = '', tripType = 'roundtrip' }: VisaServiceFormProps): React.ReactElement {
    const [destinationCountry, setDestinationCountry] = useState('');
    const [visaType, setVisaType] = useState('tourist');
    const [numberOfTravellers, setNumberOfTravellers] = useState(1);
    const [travelDate, setTravelDate] = useState(initialTravelDate);
    const [passportNationality, setPassportNationality] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const countryList = [
        { code: 'GB', name: 'United Kingdom' },
        { code: 'US', name: 'United States' },
        { code: 'CA', name: 'Canada' },
        { code: 'AU', name: 'Australia' },
        { code: 'IN', name: 'India' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
        { code: 'JP', name: 'Japan' },
        { code: 'SG', name: 'Singapore' },
        { code: 'AE', name: 'United Arab Emirates' },
    ];

    const visaTypes = [
        { value: 'tourist', label: 'Tourist Visa' },
        { value: 'business', label: 'Business Visa' },
        { value: 'student', label: 'Student Visa' },
        { value: 'work', label: 'Work Visa' },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Destination Country</label>
                <select
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: '#fff' }}
                >
                    <option value="">Select destination</option>
                    {countryList.map(country => (
                        <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Visa Type</label>
                <select
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: '#fff' }}
                >
                    {visaTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Passport Nationality</label>
                <select
                    value={passportNationality}
                    onChange={(e) => setPassportNationality(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: '#fff' }}
                >
                    <option value="">Select your nationality</option>
                    {countryList.map(country => (
                        <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Number of Travellers</label>
                <select
                    value={numberOfTravellers}
                    onChange={(e) => setNumberOfTravellers(parseInt(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: '#fff' }}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </div>

            <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Travel Date</label>
                <div
                    onClick={() => {
                        setShowDatePicker(!showDatePicker);
                    }}
                    style={{ display: 'flex', alignItems: 'center', height: '54px', border: '1.5px solid #e0e0e0', borderRadius: '10px', background: '#fff', transition: 'border-color 0.3s', cursor: 'pointer', padding: '0 16px' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d0d0d0'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                >
                    {/* Calendar Icon */}
                    <div style={{ fontSize: '16px', color: '#999', marginRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <i className="fa fa-calendar"></i>
                    </div>

                    {/* Travel Date */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                            {travelDate ? new Date(travelDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Travel Date'}
                        </div>
                    </div>

                    {/* Chevron Icon */}
                    <div style={{ fontSize: '14px', color: '#999', marginLeft: '12px', display: 'flex', alignItems: 'center' }}>
                        <i className="fa fa-chevron-down"></i>
                    </div>
                </div>
                {showDatePicker && (
                    <CalendarDateRangePicker
                        departureDate={travelDate}
                        returnDate=""
                        tripType="oneway"
                        onDateChange={(date) => {
                            setTravelDate(date);
                            setShowDatePicker(false);
                        }}
                        onClose={() => setShowDatePicker(false)}
                    />
                )}
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Trip Type</label>
                <div style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', height: '40px', boxSizing: 'border-box', background: '#f9f9f9', display: 'flex', alignItems: 'center', color: '#333' }}>
                    {tripType === 'roundtrip' ? 'Round-trip' : 'One Way'}
                </div>
            </div>
        </div>
    );
}
