import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string; // ISO format: YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  label?: string;
  autoSelect?: boolean; // Auto-select when date clicked, hide OK button
  icon?: boolean; // Show calendar icons inside the input
  inputStyle?: React.CSSProperties; // Overrides for the input's default look
}

type View = 'days' | 'months' | 'years';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS_PER_PAGE = 12;

/** "1985-03-12" as a local date (new Date("1985-03-12") would be UTC and can show the day before). */
const parseISO = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '');
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
};

const toISO = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

/**
 * Custom Date Picker Component
 * A clean date picker without external dependencies. The header's month and
 * year open a month grid and a year grid (12 years a page), so any date —
 * a date of birth decades back included — is three clicks away. Dates
 * outside minDate / maxDate can't be picked, and the arrows stop there.
 */
export default function DatePicker({ value, onChange, minDate, maxDate, label, autoSelect = true, icon = false, inputStyle }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>('days');
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startView(value, maxDate));
  const [selectedDate, setSelectedDate] = useState<string>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync selectedDate when value prop changes (for editing)
  useEffect(() => {
    setSelectedDate(value);
    if (value) setCurrentMonth(startView(value, maxDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const open = () => {
    if (isOpen) return setIsOpen(false);
    setView('days');
    setCurrentMonth(startView(selectedDate, maxDate));
    setIsOpen(true);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const minYear = minDate ? Number(minDate.slice(0, 4)) : -Infinity;
  const maxYear = maxDate ? Number(maxDate.slice(0, 4)) : Infinity;

  // ---- what can be picked ----
  const isDateDisabled = (y: number, m: number, d: number) => {
    const dateStr = toISO(y, m, d);
    return Boolean((minDate && dateStr < minDate) || (maxDate && dateStr > maxDate));
  };
  const isMonthDisabled = (y: number, m: number) => {
    const first = toISO(y, m, 1);
    const last = toISO(y, m, new Date(y, m + 1, 0).getDate());
    return Boolean((minDate && last < minDate) || (maxDate && first > maxDate));
  };
  const isYearDisabled = (y: number) => y < minYear || y > maxYear;

  // ---- arrows: a month, a year or a page of years, never past the limits ----
  const yearPageStart = Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;
  const step = (direction: -1 | 1) => {
    if (view === 'days') setCurrentMonth(new Date(year, month + direction, 1));
    else if (view === 'months') setCurrentMonth(new Date(year + direction, month, 1));
    else setCurrentMonth(new Date(year + direction * YEARS_PER_PAGE, month, 1));
  };
  const canStep = (direction: -1 | 1) => {
    if (view === 'days') {
      const target = new Date(year, month + direction, 1);
      return !isMonthDisabled(target.getFullYear(), target.getMonth());
    }
    if (view === 'months') return !isYearDisabled(year + direction);
    // years: the next page has at least one allowed year
    const pageStart = yearPageStart + direction * YEARS_PER_PAGE;
    return pageStart + YEARS_PER_PAGE - 1 >= minYear && pageStart <= maxYear;
  };

  // ---- picking ----
  const handleDayClick = (day: number) => {
    if (isDateDisabled(year, month, day)) return;
    const newDate = toISO(year, month, day);
    setSelectedDate(newDate);
    if (autoSelect) {
      onChange(newDate);
      setIsOpen(false);
    }
  };
  const pickMonth = (m: number) => {
    setCurrentMonth(new Date(year, m, 1));
    setView('days');
  };
  // A year then asks for the month, then the day
  const pickYear = (y: number) => {
    setCurrentMonth(new Date(y, month, 1));
    setView('months');
  };

  const handleOK = () => {
    if (selectedDate) {
      onChange(selectedDate);
      setIsOpen(false);
    }
  };
  const handleCancel = () => {
    setSelectedDate(value);
    setIsOpen(false);
  };

  const today = new Date();
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());
  const todayAllowed = !isDateDisabled(today.getFullYear(), today.getMonth(), today.getDate());
  const selected = parseISO(selectedDate);

  // Days grid: blanks before the 1st, then the days
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const title =
    view === 'years' ? `${yearPageStart} – ${yearPageStart + YEARS_PER_PAGE - 1}` : null;

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      {label && <label className="form-label fw-bold" style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>{label}</label>}

      <style>{STYLES}</style>

      {/* Date Input Field */}
      <div style={{ position: 'relative' }}>
        {icon && (
          <i
            className="fa-regular fa-calendar"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }}
          />
        )}
        <input
          type="text"
          className="form-control date-picker-input"
          value={selected ? selected.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
          onClick={open}
          readOnly
          placeholder="Select a date"
          style={{
            cursor: 'pointer',
            padding: icon ? '11px 38px' : '11px 12px',
            border: '2px solid #e5e7eb',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: 'inherit',
            ...inputStyle,
          }}
        />
        {icon && (
          <i
            className="fa-regular fa-calendar-days"
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }}
          />
        )}
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <div className="dp-popup" role="dialog" aria-label="Choose a date">
          {/* Header: ‹  December ▾  1985 ▾  › */}
          <div className="dp-head">
            <button
              type="button"
              className="dp-arrow"
              onClick={() => step(-1)}
              disabled={!canStep(-1)}
              aria-label={view === 'days' ? 'Previous month' : view === 'months' ? 'Previous year' : 'Previous years'}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="dp-title">
              {title ? (
                <span className="dp-range">{title}</span>
              ) : (
                <>
                  {view === 'days' && (
                    <button type="button" className="dp-title-btn" onClick={() => setView('months')} aria-label="Choose month">
                      {MONTHS[month]} <i className="fa-solid fa-caret-down"></i>
                    </button>
                  )}
                  <button
                    type="button"
                    className={`dp-title-btn ${view === 'months' ? 'active' : ''}`}
                    onClick={() => setView('years')}
                    aria-label="Choose year"
                  >
                    {year} <i className="fa-solid fa-caret-down"></i>
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              className="dp-arrow"
              onClick={() => step(1)}
              disabled={!canStep(1)}
              aria-label={view === 'days' ? 'Next month' : view === 'months' ? 'Next year' : 'Next years'}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {view === 'days' && (
            <>
              <div className="dp-weekdays">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <div key={d}>{d}</div>)}
              </div>
              <div className="dp-days">
                {cells.map((day, index) => {
                  if (!day) return <span key={`blank-${index}`} />;
                  const iso = toISO(year, month, day);
                  const disabled = isDateDisabled(year, month, day);
                  return (
                    <button
                      key={iso}
                      type="button"
                      className={`dp-day ${iso === selectedDate ? 'selected' : ''} ${iso === todayISO ? 'today' : ''}`}
                      onClick={() => handleDayClick(day)}
                      disabled={disabled}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {view === 'months' && (
            <div className="dp-grid">
              {MONTHS.map((name, m) => (
                <button
                  key={name}
                  type="button"
                  className={`dp-cell ${selected && selected.getFullYear() === year && selected.getMonth() === m ? 'selected' : ''} ${m === month ? 'current' : ''}`}
                  onClick={() => pickMonth(m)}
                  disabled={isMonthDisabled(year, m)}
                >
                  {name.slice(0, 3)}
                </button>
              ))}
            </div>
          )}

          {view === 'years' && (
            <div className="dp-grid">
              {Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i).map((y) => (
                <button
                  key={y}
                  type="button"
                  className={`dp-cell ${selected?.getFullYear() === y ? 'selected' : ''} ${y === year ? 'current' : ''}`}
                  onClick={() => pickYear(y)}
                  disabled={isYearDisabled(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          <div className="dp-foot">
            {view !== 'days' ? (
              <button type="button" className="dp-link" onClick={() => setView('days')}>
                <i className="fa-solid fa-arrow-left me-1"></i>Back to days
              </button>
            ) : todayAllowed ? (
              <button
                type="button"
                className="dp-link"
                onClick={() => {
                  setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                  handleDayClickFor(today);
                }}
              >
                Today
              </button>
            ) : <span />}

            {/* Action Buttons - Only show if not autoSelect */}
            {!autoSelect && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="dp-btn" onClick={handleCancel}>Cancel</button>
                <button type="button" className="dp-btn dp-btn-ok" onClick={handleOK}>OK</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // "Today" in the footer: picks today's date like a click on it
  function handleDayClickFor(date: Date) {
    const iso = toISO(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(iso);
    if (autoSelect) {
      onChange(iso);
      setIsOpen(false);
    }
  }
}

/** The month first shown: the chosen date's, else this month (or the latest allowed month, e.g. for a past-only date). */
function startView(value: string, maxDate?: string): Date {
  const chosen = parseISO(value);
  if (chosen) return new Date(chosen.getFullYear(), chosen.getMonth(), 1);
  const today = new Date();
  const latest = maxDate ? parseISO(maxDate) : null;
  const base = latest && latest < today ? latest : today;
  return new Date(base.getFullYear(), base.getMonth(), 1);
}

const STYLES = `
.date-picker-input::-webkit-calendar-picker-indicator { display: none; }
.date-picker-input::-webkit-outer-spin-button, .date-picker-input::-webkit-inner-spin-button { display: none; }
.dp-popup { position: absolute; top: 100%; left: 0; z-index: 9999; width: 312px; margin-top: 8px; padding: 14px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; box-shadow: 0 12px 28px rgba(17, 24, 39, .14); font-family: inherit; }
.dp-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 12px; }
.dp-arrow { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; color: #374151; font-size: 12px; transition: background .15s, color .15s; }
.dp-arrow:hover:not(:disabled) { background: #f3f0ff; color: #6d28d9; border-color: #ddd6fe; }
.dp-arrow:disabled { opacity: .35; cursor: not-allowed; }
.dp-title { display: flex; align-items: center; justify-content: center; gap: 2px; flex: 1; }
.dp-title-btn { padding: 5px 8px; border: 0; border-radius: 6px; background: transparent; color: #111827; font-size: 15px; font-weight: 700; }
.dp-title-btn i { margin-left: 2px; font-size: 11px; color: #9ca3af; }
.dp-title-btn:hover, .dp-title-btn.active { background: #f3f0ff; color: #6d28d9; }
.dp-title-btn:hover i, .dp-title-btn.active i { color: #6d28d9; }
.dp-range { font-size: 15px; font-weight: 700; color: #111827; }
.dp-weekdays, .dp-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.dp-weekdays { margin-bottom: 6px; }
.dp-weekdays div { padding: 4px 0; text-align: center; font-size: 12px; font-weight: 600; color: #9ca3af; }
.dp-day { height: 36px; border: 0; border-radius: 8px; background: transparent; color: #1f2937; font-size: 13px; font-weight: 500; transition: background .12s; }
.dp-day:hover:not(:disabled):not(.selected) { background: #f3f0ff; color: #6d28d9; }
.dp-day.today:not(.selected) { box-shadow: inset 0 0 0 1px #6d28d9; color: #6d28d9; font-weight: 700; }
.dp-day.selected { background: #6d28d9; color: #fff; font-weight: 700; }
.dp-day:disabled { color: #d1d5db; cursor: not-allowed; }
.dp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 4px 0; }
.dp-cell { height: 44px; border: 0; border-radius: 8px; background: #f9fafb; color: #1f2937; font-size: 14px; font-weight: 600; transition: background .12s; }
.dp-cell:hover:not(:disabled):not(.selected) { background: #f3f0ff; color: #6d28d9; }
.dp-cell.current:not(.selected) { box-shadow: inset 0 0 0 1px #c4b5fd; }
.dp-cell.selected { background: #6d28d9; color: #fff; }
.dp-cell:disabled { background: transparent; color: #d1d5db; cursor: not-allowed; }
.dp-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #f3f4f6; }
.dp-link { padding: 0; border: 0; background: none; color: #6d28d9; font-size: 13px; font-weight: 600; }
.dp-link:hover { text-decoration: underline; }
.dp-btn { padding: 6px 14px; border: 1px solid #e5e7eb; border-radius: 6px; background: #f9fafb; font-size: 12px; font-weight: 500; }
.dp-btn-ok { border-color: #16a34a; background: #16a34a; color: #fff; }
`;
