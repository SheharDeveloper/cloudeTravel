import { useState, useRef, useEffect } from 'react';

interface CustomDatePickerProps {
    value: string;
    onChange: (date: string) => void;
    label?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

export default function CustomDatePicker({
    value,
    onChange,
    label,
    disabled = false,
    required = false,
    className = '',
}: CustomDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date(value || new Date()));
    const containerRef = useRef<HTMLDivElement>(null);

    // Get days in month
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const days = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const selectDate = (day: number) => {
        const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateString = selected.toISOString().split('T')[0]; // YYYY-MM-DD format
        onChange(dateString);
        setIsOpen(false);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Generate array of day numbers with empty slots for days before month starts
    const calendarDays = Array(firstDay).fill(null).concat(Array.from({ length: days }, (_, i) => i + 1));

    return (
        <div ref={containerRef} className={`position-relative ${className}`}>
            {label && <label className="form-label fw-bold">{label}</label>}

            <div className="input-group">
                <input
                    type="text"
                    className="form-control form-control-lg"
                    value={formatDate(value)}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    readOnly
                    disabled={disabled}
                    placeholder="Select date"
                    required={required}
                />
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
                >
                    <i className="fa fa-calendar"></i>
                </button>
            </div>

            {isOpen && !disabled && (
                <div className="card position-absolute" style={{ top: '100%', left: 0, zIndex: 9999, marginTop: '5px', minWidth: '300px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
                    <div className="card-body p-3">
                        {/* Month Navigation */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <button
                                className="btn btn-sm btn-light"
                                onClick={previousMonth}
                                type="button"
                            >
                                <i className="fa fa-chevron-left"></i>
                            </button>
                            <div className="fw-bold text-center" style={{ flex: 1 }}>
                                {monthName}
                            </div>
                            <button
                                className="btn btn-sm btn-light"
                                onClick={nextMonth}
                                type="button"
                            >
                                <i className="fa fa-chevron-right"></i>
                            </button>
                        </div>

                        {/* Day Headers */}
                        <div className="row row-cols-7 g-1 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="col text-center">
                                    <small className="fw-bold text-muted">{day}</small>
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="row row-cols-7 g-1">
                            {calendarDays.map((day, index) => {
                                const isSelected = day && value === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
                                const isToday = day && new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString() === new Date().toDateString();

                                return (
                                    <div key={index} className="col">
                                        {day ? (
                                            <button
                                                type="button"
                                                onClick={() => selectDate(day)}
                                                className={`w-100 btn btn-sm rounded ${
                                                    isSelected
                                                        ? 'btn-primary'
                                                        : isToday
                                                        ? 'btn-outline-primary'
                                                        : 'btn-light text-dark'
                                                }`}
                                            >
                                                {day}
                                            </button>
                                        ) : (
                                            <div />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Today Button */}
                        <div className="mt-3 pt-2 border-top">
                            <button
                                type="button"
                                className="btn btn-sm btn-link w-100"
                                onClick={() => {
                                    const today = new Date().toISOString().split('T')[0];
                                    onChange(today);
                                    setIsOpen(false);
                                }}
                            >
                                Today
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
