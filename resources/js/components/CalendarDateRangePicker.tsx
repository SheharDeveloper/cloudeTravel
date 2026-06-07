import { useState } from 'react';

interface CalendarDateRangePickerProps {
    departureDate: string;
    returnDate: string;
    tripType: 'oneway' | 'roundtrip';
    onDateChange: (departure: string, returnDate: string) => void;
    onClose: () => void;
}

// Helper function to format date in local timezone (not UTC)
const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function CalendarDateRangePicker({
    departureDate,
    returnDate,
    tripType,
    onDateChange,
    onClose
}: CalendarDateRangePickerProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedStart, setSelectedStart] = useState<Date | null>(departureDate ? new Date(departureDate) : null);
    const [selectedEnd, setSelectedEnd] = useState<Date | null>(returnDate ? new Date(returnDate) : null);
    const [isSelectingRange, setIsSelectingRange] = useState(false);

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

        if (!isSelectingRange) {
            setSelectedStart(clickedDate);
            setSelectedEnd(null);
            setIsSelectingRange(true);

            // Auto-close for one-way trips (single date selection)
            if (tripType === 'oneway') {
                const depDate = formatDateLocal(clickedDate);
                onDateChange(depDate, '');
                onClose();
            }
        } else {
            let startDate: Date, endDate: Date;

            if (clickedDate < selectedStart!) {
                startDate = clickedDate;
                endDate = selectedStart!;
            } else {
                startDate = selectedStart!;
                endDate = clickedDate;
            }

            setSelectedStart(startDate);
            setSelectedEnd(endDate);
            setIsSelectingRange(false);

            // Auto-close for round-trip when both dates are selected
            if (tripType === 'roundtrip') {
                const depDate = formatDateLocal(startDate);
                const retDate = formatDateLocal(endDate);
                onDateChange(depDate, retDate);
                onClose();
            }
        }
    };

    const isDateInRange = (date: Date) => {
        if (!selectedStart || !selectedEnd) return false;
        return date >= selectedStart && date <= selectedEnd;
    };

    const isSelectedDate = (date: Date) => {
        if (!selectedStart) return false;
        if (selectedStart.toDateString() === date.toDateString()) return true;
        if (selectedEnd && selectedEnd.toDateString() === date.toDateString()) return true;
        return false;
    };

    const renderMonth = (monthDate: Date) => {
        const daysInMonth = getDaysInMonth(monthDate);
        const firstDay = getFirstDayOfMonth(monthDate);

        const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '12px' }}>
                    {monthName}
                </div>

                {/* Week day headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                    {weekDays.map(day => (
                        <div key={day} style={{ fontSize: '11px', fontWeight: 600, color: '#999', textAlign: 'center', padding: '4px' }}>
                            {day.substring(0, 2)}
                        </div>
                    ))}
                </div>

                {/* Calendar days */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {/* Empty cells for days before month starts */}
                    {Array(firstDay).fill(null).map((_, i) => (
                        <div key={`empty-${i}`}></div>
                    ))}

                    {/* Day cells */}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
                        const inRange = isDateInRange(date);
                        const isSelected = isSelectedDate(date);

                        return (
                            <button
                                key={day}
                                onClick={() => handleDateClick(day)}
                                style={{
                                    padding: '8px',
                                    border: 'none',
                                    borderRadius: '50%',
                                    background: isSelected ? '#0066cc' : inRange ? '#e8f1ff' : 'transparent',
                                    color: isSelected ? '#fff' : '#333',
                                    fontSize: '12px',
                                    fontWeight: isSelected ? 600 : 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.background = '#f0f0f0';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.background = inRange ? '#e8f1ff' : 'transparent';
                                    }
                                }}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);

    return (
        <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px', background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,.2)', zIndex: 9999, border: '1px solid #e0e0e0', minWidth: '520px' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
                <button style={{ fontSize: '14px', fontWeight: 600, color: '#0066cc', border: 'none', background: 'none', cursor: 'pointer', paddingBottom: '4px', borderBottom: '2px solid #0066cc' }}>
                    Calendar
                </button>
                <button style={{ fontSize: '14px', fontWeight: 500, color: '#999', border: 'none', background: 'none', cursor: 'pointer', paddingBottom: '4px' }}>
                    I'm flexible
                </button>
            </div>

            {/* Calendar months */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', justifyContent: 'space-between' }}>
                {renderMonth(currentMonth)}
                {renderMonth(nextMonth)}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '16px' }}
                >
                    <i className="fa fa-chevron-left"></i>
                </button>
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '16px' }}
                >
                    <i className="fa fa-chevron-right"></i>
                </button>
            </div>

            {/* Selection info - Auto closes on date selection, so no Done button needed */}
            {selectedStart && (
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '0px', textAlign: 'center' }}>
                    {selectedEnd && tripType === 'roundtrip'
                        ? `${selectedStart.toLocaleDateString()} - ${selectedEnd.toLocaleDateString()}`
                        : selectedStart.toLocaleDateString()}
                </div>
            )}
        </div>
    );
}
