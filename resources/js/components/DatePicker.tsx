import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string; // ISO format: YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  label?: string;
  autoSelect?: boolean; // Auto-select when date clicked, hide OK button
}

/**
 * Custom Date Picker Component
 * A simple, clean date picker without external dependencies
 * Shows calendar UI with month/year navigation and OK button
 */
export default function DatePicker({ value, onChange, minDate, maxDate, label, autoSelect = true }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(value ? new Date(value) : new Date());
  const [selectedDate, setSelectedDate] = useState<string>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync selectedDate when value prop changes (for editing)
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

  // Check if date is disabled
  const isDateDisabled = (year: number, month: number, day: number) => {
    const dateStr = formatToISO(year, month, day);
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  // Handle day click - auto select
  const handleDayClick = (day: number) => {
    if (isDateDisabled(currentMonth.getFullYear(), currentMonth.getMonth(), day)) {
      return;
    }

    const newDate = formatToISO(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);

    // Auto-select if enabled
    if (autoSelect) {
      onChange(newDate);
      setIsOpen(false);
    }
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
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      {label && <label className="form-label fw-bold" style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>{label}</label>}

      <style>{`
        .date-picker-input::-webkit-calendar-picker-indicator {
          display: none;
        }
        .date-picker-input::-webkit-outer-spin-button,
        .date-picker-input::-webkit-inner-spin-button {
          display: none;
        }
      `}</style>

      {/* Date Input Field */}
      <input
        type="text"
        className="form-control date-picker-input"
        value={formatDate(selectedDate)}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
        placeholder="Select a date"
        style={{
          cursor: 'pointer',
          padding: '11px 12px',
          border: '2px solid #e5e7eb',
          borderRadius: '10px',
          fontSize: '14px',
          fontFamily: 'inherit'
        }}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              style={{
                background: '#f0f0f0',
                border: '1px solid #ddd',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '4px',
                color: '#333',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#e0e0e0'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
            >
              &#8249; Prev
            </button>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'center' }}>{monthYear}</div>
            <button
              type="button"
              onClick={handleNextMonth}
              style={{
                background: '#f0f0f0',
                border: '1px solid #ddd',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '4px',
                color: '#333',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#e0e0e0'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
            >
              Next &#8250;
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
            {calendarDays.map((day, index) => {
              const isDisabled = day && isDateDisabled(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const isSelected = day && selectedDate === formatToISO(currentMonth.getFullYear(), currentMonth.getMonth(), day);

              return (
              <button
                key={index}
                type="button"
                onClick={() => day && !isDisabled && handleDayClick(day)}
                disabled={!day || !!isDisabled}
                style={{
                  padding: '8px 4px',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  cursor: isDisabled ? 'not-allowed' : (day ? 'pointer' : 'default'),
                  backgroundColor: isSelected
                    ? '#6d28d9'
                    : isDisabled ? '#f3f4f6'
                    : 'transparent',
                  color: isSelected
                    ? 'white'
                    : isDisabled ? '#d1d5db'
                    : day ? '#333' : '#ccc',
                  fontSize: '12px',
                  fontWeight: 500,
                  opacity: !day ? 0.3 : (isDisabled ? 0.5 : 1),
                  transition: 'all 0.2s',
                  textDecoration: isDisabled ? 'line-through' : 'none'
                }}
              >
                {day || ''}
              </button>
            );
            })}
          </div>

          {/* Action Buttons - Only show if not autoSelect */}
          {!autoSelect && (
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
          )}
        </div>
      )}
    </div>
  );
}
