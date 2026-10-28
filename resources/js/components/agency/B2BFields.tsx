import CountrySelect from '@/components/CountrySelect';

/**
 * B2B agency registration (Form A): the fields the agency form asks besides
 * name, address and contact details — on the step each belongs to. Shared by
 * Agency → Add and Agency → Edit.
 */

export interface B2BData {
    contact_name: string;
    contact_position: string;
    registration_country: string;
    branches_count: string;
    preferred_currency: string;
    expected_monthly_bookings: string;
    payment_terms: string;
    vat_registered: boolean;
    vat_number: string;
    authorised_rep_name: string;
    authorised_rep_position: string;
    terms_accepted: boolean;
}

export interface B2BOptions {
    currencies: Record<string, string>;
    countries: { id: number; countryName: string; countryCode: string; flag_url?: string }[];
    monthlyBookings: Record<string, string>;
    paymentTerms: Record<string, string>;
    // Country name => its tax's name from Tax Setup (India => GST, United Kingdom => VAT)
    taxNames: Record<string, string>;
}

/** The tax's name for the country of registration, as Tax Setup has it ("Tax" when none is set up) */
export const taxNameFor = (taxNames: Record<string, string> | undefined, country: string) => taxNames?.[country] || 'Tax';

/** Which step each field is on (for "Next" checks and saving) */
const STEP_FIELDS: Record<number, (keyof B2BData)[]> = {
    1: ['contact_name', 'contact_position'],
    2: ['registration_country'],
    3: ['branches_count', 'preferred_currency', 'expected_monthly_bookings', 'payment_terms', 'vat_registered', 'vat_number', 'authorised_rep_name', 'authorised_rep_position'],
    4: ['terms_accepted'],
};

/** An agency's saved values (or blanks for a new one) */
export const b2bInitial = (agency?: any): B2BData => ({
    contact_name: agency?.contact_name ?? '',
    contact_position: agency?.contact_position ?? '',
    registration_country: agency?.registration_country ?? '',
    branches_count: agency?.branches_count != null ? String(agency.branches_count) : '',
    preferred_currency: agency?.preferred_currency ?? '',
    expected_monthly_bookings: agency?.expected_monthly_bookings ?? '',
    payment_terms: agency?.payment_terms ?? '',
    vat_registered: !!agency?.vat_registered,
    vat_number: agency?.vat_number ?? '',
    authorised_rep_name: agency?.authorised_rep_name ?? '',
    authorised_rep_position: agency?.authorised_rep_position ?? '',
    terms_accepted: !!agency?.terms_accepted_at,
});

/** Adds the step's B2B fields (or every step's, with no step) to the form being sent */
export function appendB2B(formData: FormData, data: B2BData, step?: number) {
    const keys = step ? STEP_FIELDS[step] ?? [] : Object.values(STEP_FIELDS).flat();
    keys.forEach((key) => {
        const value = data[key];
        formData.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : value);
    });
}

const Required = () => <span className="text-danger"> *</span>;

export default function B2BFields({ step, data, onChange, errors, options, termsAcceptedAt }: {
    step: number;
    data: B2BData;
    onChange: (patch: Partial<B2BData>) => void;
    errors: Record<string, string>;
    options: B2BOptions;
    // Edit: when the agency accepted the terms
    termsAcceptedAt?: string | null;
}) {
    const input = (key: keyof B2BData, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, col = 'col-sm-6') => (
        <div className={`${col} mb-4`}>
            <label className="form-label">{label}<Required /></label>
            <input
                type="text"
                className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                value={data[key] as string}
                onChange={(e) => onChange({ [key]: e.target.value })}
                {...props}
            />
            {errors[key] && <div className="invalid-feedback d-block">{errors[key]}</div>}
        </div>
    );

    const select = (key: keyof B2BData, label: string, choices: Record<string, string>, col = 'col-12 col-lg-4') => (
        <div className={`${col} mb-4`}>
            <label className="form-label">{label}<Required /></label>
            <select className={`form-select ${errors[key] ? 'is-invalid' : ''}`} value={data[key] as string} onChange={(e) => onChange({ [key]: e.target.value })}>
                <option value="">Select</option>
                {Object.entries(choices).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
            </select>
            {errors[key] && <div className="invalid-feedback d-block">{errors[key]}</div>}
        </div>
    );

    if (step === 1) {
        return (
            <>
                {input('contact_name', 'Main Contact Name')}
                {input('contact_position', 'Main Contact Position', { placeholder: 'e.g. Operations Manager' })}
            </>
        );
    }

    if (step === 2) {
        return (
            <div className="col-12 col-sm-6 mb-4">
                <label className="form-label">Country of Registration<Required /></label>
                {/* Searchable, with flags (same box as Visas → Create) */}
                <CountrySelect
                    id="registration_country"
                    value={data.registration_country}
                    onChange={(country) => onChange({ registration_country: country })}
                    countries={options.countries}
                    placeholder="Search country"
                    regularSize
                    invalid={!!errors.registration_country}
                />
                {errors.registration_country && <div className="invalid-feedback d-block">{errors.registration_country}</div>}
            </div>
        );
    }

    if (step === 3) {
        const tax = taxNameFor(options.taxNames, data.registration_country);
        return (
            <>
                <div className="col-12"><h6 className="text-primary mb-3">Business Details</h6></div>
                {input('branches_count', 'Number of Branches', { type: 'number', min: 1, placeholder: 'Including head office' }, 'col-12 col-lg-4')}
                {select('preferred_currency', 'Preferred Currency', options.currencies)}
                {select('expected_monthly_bookings', 'Expected Monthly Booking Volume', options.monthlyBookings)}
                {select('payment_terms', 'Requested Payment Terms', options.paymentTerms)}

                {/* VAT / GST…: where applicable, named as Tax Setup names it for the country of registration */}
                <div className="col-12 col-lg-4 mb-4">
                    <label className="form-label">{tax} Registered?</label>
                    <div className="d-flex gap-3 pt-2">
                        {[true, false].map((yes) => (
                            <div key={String(yes)} className="form-check mb-0">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id={`vat-${yes}`}
                                    checked={data.vat_registered === yes}
                                    onChange={() => onChange({ vat_registered: yes })}
                                />
                                <label className="form-check-label" htmlFor={`vat-${yes}`}>{yes ? 'Yes' : 'No'}</label>
                            </div>
                        ))}
                    </div>
                </div>
                {data.vat_registered ? input('vat_number', `${tax} Registration Number`, {}, 'col-12 col-lg-4') : <div className="col-12 col-lg-4" />}

                <div className="col-12"><h6 className="text-primary mb-3 mt-1">Authorised Representative</h6></div>
                {input('authorised_rep_name', 'Full Name')}
                {input('authorised_rep_position', 'Position / Designation', { placeholder: 'e.g. Director' })}

                <div className="col-12"><h6 className="text-primary mb-3 mt-1">Tax &amp; Bank</h6></div>
            </>
        );
    }

    if (step === 4) {
        return (
            <div className={`border rounded p-3 mt-2 ${errors.terms_accepted ? 'border-danger' : ''}`} style={{ background: '#f8f9fc' }}>
                <div className="form-check mb-0">
                    <input
                        className={`form-check-input ${errors.terms_accepted ? 'is-invalid' : ''}`}
                        type="checkbox"
                        id="terms_accepted"
                        checked={data.terms_accepted}
                        disabled={!!termsAcceptedAt}
                        onChange={(e) => onChange({ terms_accepted: e.target.checked })}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="terms_accepted">
                        The agency accepts the <u>B2B Agreement</u> and the platform terms<Required />
                    </label>
                </div>
                {termsAcceptedAt && <small className="text-success d-block mt-1"><i className="fa fa-check-circle me-1"></i>Accepted on {termsAcceptedAt}</small>}
                {errors.terms_accepted && <div className="invalid-feedback d-block">{errors.terms_accepted}</div>}
            </div>
        );
    }

    return null;
}
