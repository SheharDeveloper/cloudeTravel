import { useState, useEffect } from 'react';

interface DatePickerProps {
  value: string; // ISO format: YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  label?: string;
}

/**
 * Custom Date Picker Component
 * A simple, clean date picker without external dependencies
 * Shows calendar UI with month/year navigation and OK button
 */
export default function DatePicker({ value, onChange, minDate, maxDate, label }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(value ? new Date(value) : new Date());
  const [selectedDate, setSelectedDate] = useState<string>(value);

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0-6, where 0 is Sunday)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (number | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Format date to YYYY-MM-DD
  const formatToISO = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Handle day click
  const handleDayClick = (day: number) => {
    const newDate = formatToISO(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  // Handle OK button click
  const handleOK = () => {
    if (selectedDate) {
      onChange(selectedDate);
      setIsOpen(false);
    }
  };

  // Handle Cancel
  const handleCancel = () => {
    setSelectedDate(value);
    setIsOpen(false);
  };

  // Previous month
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  // Next month
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const calendarDays = generateCalendarDays();
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      {label && <label className="form-label fw-bold">{label}</label>}

      {/* Date Input Field */}
      <input
        type="text"
        className="form-control"
        value={formatDate(selectedDate)}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
        placeholder="Select a date"
        style={{ cursor: 'pointer' }}
      />

      {/* Calendar Popup */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            padding: '16px',
            minWidth: '320px',
            marginTop: '8px',
          }}
        >
          {/* Month/Year Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              ← Prev
            </button>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{monthYear}</div>
            <button
              type="button"
              onClick={handleNextMonth}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Next →
            </button>
          </div>

          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#666',
                  padding: '4px',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '16px' }}>
            {calendarDays.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => day && handleDayClick(day)}
                disabled={!day}
                style={{
                  padding: '8px 4px',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  cursor: day ? 'pointer' : 'default',
                  backgroundColor:
                    day && selectedDate === formatToISO(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                      ? '#003d82'
                      : 'transparent',
                  color:
                    day && selectedDate === formatToISO(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                      ? 'white'
                      : day ? '#333' : '#ccc',
                  fontSize: '12px',
                  fontWeight: 500,
                  opacity: day ? 1 : 0.3,
                  transition: 'all 0.2s',
                }}
              >
                {day || ''}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: '#f0f0f0',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleOK}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: '#28a745',
                color: 'white',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
