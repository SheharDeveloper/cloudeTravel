import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import DatePicker from '@/components/DatePicker';

type FamilyMember = { name: string; relation: string; dob: string; passport_number: string; id_number: string };

const STEPS = ['1. Basic Info', '2. Address', '3. Passport & Visa', '4. Family Details'];

const emptyFamilyMember: FamilyMember = { name: '', relation: '', dob: '', passport_number: '', id_number: '' };

export default function ClientCreate() {
    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');

    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        nationality: '',
        gender: '',
        dob: '',
        notes: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip_code: '',
        passport_number: '',
        place_of_issue: '',
        date_of_issue: '',
        expiry_date: '',
        front_image: null as File | null,
        back_image: null as File | null,
        is_foreigner: false,
        visa_type: '',
        visa_number: '',
        visa_expiry_date: '',
        family_members: [{ ...emptyFamilyMember }] as FamilyMember[],
    });

    const set = (patch: Partial<typeof data>) => setData({ ...data, ...patch });

    const clearError = (key: string) => {
        if (errors[key]) {
            const next = { ...errors };
            delete next[key];
            setErrors(next);
        }
    };

    const appendBasic = (formData: FormData) => {
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('nationality', data.nationality);
        formData.append('gender', data.gender);
        formData.append('dob', data.dob);
        formData.append('notes', data.notes);
    };

    const appendAddress = (formData: FormData) => {
        formData.append('address', data.address);
        formData.append('city', data.city);
        formData.append('state', data.state);
        formData.append('country', data.country);
        formData.append('zip_code', data.zip_code);
    };

    const appendPassport = (formData: FormData) => {
        formData.append('passport_number', data.passport_number);
        formData.append('place_of_issue', data.place_of_issue);
        formData.append('date_of_issue', data.date_of_issue);
        formData.append('expiry_date', data.expiry_date);
        if (data.front_image) formData.append('front_image', data.front_image);
        if (data.back_image) formData.append('back_image', data.back_image);
        formData.append('is_foreigner', data.is_foreigner ? '1' : '0');
        if (data.is_foreigner) {
            formData.append('visa_type', data.visa_type);
            formData.append('visa_number', data.visa_number);
            formData.append('visa_expiry_date', data.visa_expiry_date);
        }
    };

    const appendFamily = (formData: FormData) => {
        data.family_members.forEach((row, i) => {
            if (!row.name) return;
            formData.append(`family_members[${i}][name]`, row.name);
            formData.append(`family_members[${i}][relation]`, row.relation);
            if (row.dob) formData.append(`family_members[${i}][dob]`, row.dob);
            formData.append(`family_members[${i}][passport_number]`, row.passport_number);
            formData.append(`family_members[${i}][id_number]`, row.id_number);
        });
    };

    const handleNext = async () => {
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('step', step.toString());

        if (step === 1) appendBasic(formData);
        else if (step === 2) appendAddress(formData);
        else if (step === 3) appendPassport(formData);
        else appendFamily(formData);

        try {
            const response = await axios.post('/admin/clients/validate-step', formData);
            if (response.data.success) {
                setStep(step + 1);
                setErrors({});
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                const backendErrors = error.response.data.errors || {};
                const formatted: Record<string, string> = {};
                Object.keys(backendErrors).forEach((key) => {
                    formatted[key] = Array.isArray(backendErrors[key]) ? backendErrors[key][0] : backendErrors[key];
                });
                setErrors(formatted);
            } else {
                setErrors({ submit: 'An error occurred during validation' });
            }
        } finally {
            setProcessing(false);
        }
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        appendBasic(formData);
        appendAddress(formData);
        appendPassport(formData);
        appendFamily(formData);

        router.post('/admin/clients', formData, {
            onSuccess: () => {
                setSuccessMessage('Client created successfully!');
                setTimeout(() => router.visit('/admin/clients'), 1500);
            },
            onError: (err) => {
                setErrors(err as Record<string, string>);
                setProcessing(false);
            },
        });
    };

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Add Client</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/clients">Client Management</a></li>
                        <li className="breadcrumb-item active">Create</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-xl-3">
                    <div className="card h-auto">
                        <div className="card-body py-sm-5">
                            <div className="text-center">
                                <div
                                    className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto"
                                    style={{ width: 80, height: 80 }}
                                >
                                    <span className="text-primary fw-bold fs-24">
                                        {data.name ? data.name.charAt(0).toUpperCase() : 'C'}
                                    </span>
                                </div>
                                <div className="clearfix mt-3">
                                    <h6 className="mb-0">{data.name || 'Client Name'}</h6>
                                    <span className="text-muted">Client</span>
                                </div>
                            </div>
                        </div>

                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between py-3">
                                <span className="text-muted">Email</span>
                                <span className="text-truncate ms-2" style={{ maxWidth: 140 }}>{data.email || '—'}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between py-3">
                                <span className="text-muted">Phone</span>
                                <span>{data.phone || '—'}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between py-3">
                                <span className="text-muted">Nationality</span>
                                <span>{data.nationality || '—'}</span>
                            </li>
                        </ul>

                        <div className="card-footer p-4">
                            <a href="/admin/clients" className="btn btn-outline-primary w-100">Back To List</a>
                        </div>
                    </div>
                </div>

                <div className="col-xl-9">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="card-title mb-0">Client Setup</h6>
                        </div>

                        <div className="card-body">
                            <div className="d-flex gap-2 mb-4 flex-wrap">
                                {STEPS.map((label, i) => (
                                    <span key={label} className={`badge ${step === i + 1 ? 'bg-primary' : 'bg-light text-dark'}`}>
                                        {label}
                                    </span>
                                ))}
                            </div>

                            <form onSubmit={submit}>
                                {/* ── Step 1: Basic Info ────────────────────────── */}
                                {step === 1 && (
                                    <div className="row">
                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Full Name</label>
                                            <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={data.name}
                                                onChange={(e) => { set({ name: e.target.value }); clearError('name'); }} />
                                            {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Email</label>
                                            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={data.email}
                                                onChange={(e) => { set({ email: e.target.value }); clearError('email'); }} />
                                            {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Phone</label>
                                            <input type="text" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={data.phone}
                                                onChange={(e) => { set({ phone: e.target.value }); clearError('phone'); }} />
                                            {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Nationality</label>
                                            <input type="text" className={`form-control ${errors.nationality ? 'is-invalid' : ''}`} value={data.nationality}
                                                placeholder="e.g. Indian"
                                                onChange={(e) => { set({ nationality: e.target.value }); clearError('nationality'); }} />
                                            {errors.nationality && <div className="invalid-feedback d-block">{errors.nationality}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Gender</label>
                                            <select className={`form-select ${errors.gender ? 'is-invalid' : ''}`} value={data.gender}
                                                onChange={(e) => { set({ gender: e.target.value }); clearError('gender'); }}>
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.gender && <div className="invalid-feedback d-block">{errors.gender}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <DatePicker
                                                label="Date of Birth"
                                                value={data.dob}
                                                onChange={(date) => { set({ dob: date }); clearError('dob'); }}
                                                maxDate={new Date().toISOString().split('T')[0]}
                                                autoSelect={true}
                                            />
                                            {errors.dob && <div className="invalid-feedback d-block">{errors.dob}</div>}
                                        </div>

                                        <div className="col-12 mb-4">
                                            <label className="form-label">Notes</label>
                                            <textarea className={`form-control ${errors.notes ? 'is-invalid' : ''}`} rows={3} value={data.notes}
                                                onChange={(e) => { set({ notes: e.target.value }); clearError('notes'); }} />
                                            {errors.notes && <div className="invalid-feedback d-block">{errors.notes}</div>}
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 2: Address ───────────────────────────── */}
                                {step === 2 && (
                                    <div className="row">
                                        <div className="col-12 mb-4">
                                            <label className="form-label">Address</label>
                                            <textarea className={`form-control ${errors.address ? 'is-invalid' : ''}`} rows={3} value={data.address}
                                                onChange={(e) => { set({ address: e.target.value }); clearError('address'); }} />
                                            {errors.address && <div className="invalid-feedback d-block">{errors.address}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">City</label>
                                            <input type="text" className={`form-control ${errors.city ? 'is-invalid' : ''}`} value={data.city}
                                                onChange={(e) => { set({ city: e.target.value }); clearError('city'); }} />
                                            {errors.city && <div className="invalid-feedback d-block">{errors.city}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">State</label>
                                            <input type="text" className={`form-control ${errors.state ? 'is-invalid' : ''}`} value={data.state}
                                                onChange={(e) => { set({ state: e.target.value }); clearError('state'); }} />
                                            {errors.state && <div className="invalid-feedback d-block">{errors.state}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Country</label>
                                            <input type="text" className={`form-control ${errors.country ? 'is-invalid' : ''}`} value={data.country}
                                                onChange={(e) => { set({ country: e.target.value }); clearError('country'); }} />
                                            {errors.country && <div className="invalid-feedback d-block">{errors.country}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Zip Code</label>
                                            <input type="text" className={`form-control ${errors.zip_code ? 'is-invalid' : ''}`} value={data.zip_code}
                                                onChange={(e) => { set({ zip_code: e.target.value }); clearError('zip_code'); }} />
                                            {errors.zip_code && <div className="invalid-feedback d-block">{errors.zip_code}</div>}
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 3: Passport & Visa ───────────────────── */}
                                {step === 3 && (
                                    <div className="row">
                                        <div className="col-12"><h6 className="mb-3">Passport</h6></div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Passport Number</label>
                                            <input type="text" className={`form-control ${errors.passport_number ? 'is-invalid' : ''}`} value={data.passport_number}
                                                onChange={(e) => { set({ passport_number: e.target.value }); clearError('passport_number'); }} />
                                            {errors.passport_number && <div className="invalid-feedback d-block">{errors.passport_number}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Place of Issue</label>
                                            <input type="text" className={`form-control ${errors.place_of_issue ? 'is-invalid' : ''}`} value={data.place_of_issue}
                                                onChange={(e) => { set({ place_of_issue: e.target.value }); clearError('place_of_issue'); }} />
                                            {errors.place_of_issue && <div className="invalid-feedback d-block">{errors.place_of_issue}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <DatePicker label="Date of Issue" value={data.date_of_issue}
                                                onChange={(d) => { set({ date_of_issue: d }); clearError('date_of_issue'); }}
                                                maxDate={new Date(Date.now() - 86400000).toISOString().split('T')[0]}
                                                autoSelect={true} />
                                            {errors.date_of_issue && <div className="invalid-feedback d-block">{errors.date_of_issue}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <DatePicker label="Passport Expiry Date" value={data.expiry_date}
                                                onChange={(d) => { set({ expiry_date: d }); clearError('expiry_date'); }}
                                                minDate={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                                autoSelect={true} />
                                            {errors.expiry_date && <div className="invalid-feedback d-block">{errors.expiry_date}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Passport Front</label>
                                            <input type="file" className={`form-control ${errors.front_image ? 'is-invalid' : ''}`} accept="image/*"
                                                onChange={(e) => { set({ front_image: e.target.files?.[0] || null }); clearError('front_image'); }} />
                                            {errors.front_image && <div className="invalid-feedback d-block">{errors.front_image}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Passport Back</label>
                                            <input type="file" className={`form-control ${errors.back_image ? 'is-invalid' : ''}`} accept="image/*"
                                                onChange={(e) => { set({ back_image: e.target.files?.[0] || null }); clearError('back_image'); }} />
                                            {errors.back_image && <div className="invalid-feedback d-block">{errors.back_image}</div>}
                                        </div>

                                        <div className="col-12"><hr /></div>

                                        <div className="col-12 mb-4">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="is_foreigner" checked={data.is_foreigner}
                                                    onChange={(e) => set({ is_foreigner: e.target.checked })} />
                                                <label className="form-check-label" htmlFor="is_foreigner">
                                                    Foreign national — visa required
                                                </label>
                                            </div>
                                            <small className="text-muted">Leave unchecked if this client does not need visa details.</small>
                                        </div>

                                        {data.is_foreigner && (
                                            <>
                                                <div className="col-12"><h6 className="mb-3">Visa Details</h6></div>

                                                <div className="col-sm-4 mb-4">
                                                    <label className="form-label">Type of Visa</label>
                                                    <select className={`form-select ${errors.visa_type ? 'is-invalid' : ''}`} value={data.visa_type}
                                                        onChange={(e) => { set({ visa_type: e.target.value }); clearError('visa_type'); }}>
                                                        <option value="">Select Visa Type</option>
                                                        <option value="work">Work Visa</option>
                                                        <option value="student">Student Visa</option>
                                                        <option value="business">Business Visa</option>
                                                        <option value="tourist">Tourist Visa</option>
                                                        <option value="permanent_resident">Permanent Resident</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                    {errors.visa_type && <div className="invalid-feedback d-block">{errors.visa_type}</div>}
                                                </div>

                                                <div className="col-sm-4 mb-4">
                                                    <label className="form-label">Visa Number</label>
                                                    <input type="text" className={`form-control ${errors.visa_number ? 'is-invalid' : ''}`} value={data.visa_number}
                                                        onChange={(e) => { set({ visa_number: e.target.value }); clearError('visa_number'); }} />
                                                    {errors.visa_number && <div className="invalid-feedback d-block">{errors.visa_number}</div>}
                                                </div>

                                                <div className="col-sm-4 mb-4">
                                                    <DatePicker label="Visa Expiry Date" value={data.visa_expiry_date}
                                                        onChange={(d) => { set({ visa_expiry_date: d }); clearError('visa_expiry_date'); }} autoSelect={true} />
                                                    {errors.visa_expiry_date && <div className="invalid-feedback d-block">{errors.visa_expiry_date}</div>}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* ── Step 4: Family Details ────────────────────── */}
                                {step === 4 && (
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">Family Members</h6>
                                            <button type="button" className="btn btn-sm btn-primary"
                                                onClick={() => set({ family_members: [...data.family_members, { ...emptyFamilyMember }] })}>
                                                <i className="fa fa-plus me-1"></i>Add More
                                            </button>
                                        </div>

                                        {data.family_members.map((row, i) => (
                                            <div key={i} className="border rounded p-4 mb-3">
                                                <div className="row">
                                                    <div className="col-md-4 mb-3">
                                                        <label className="form-label">Name</label>
                                                        <input type="text" className="form-control" value={row.name}
                                                            onChange={(e) => {
                                                                const next = [...data.family_members];
                                                                next[i] = { ...next[i], name: e.target.value };
                                                                set({ family_members: next });
                                                            }} />
                                                    </div>
                                                    <div className="col-md-4 mb-3">
                                                        <label className="form-label">Relation</label>
                                                        <input type="text" className="form-control" placeholder="Spouse, Child, Parent"
                                                            value={row.relation}
                                                            onChange={(e) => {
                                                                const next = [...data.family_members];
                                                                next[i] = { ...next[i], relation: e.target.value };
                                                                set({ family_members: next });
                                                            }} />
                                                    </div>
                                                    <div className="col-md-4 mb-3">
                                                        <DatePicker label="Date of Birth" value={row.dob}
                                                            onChange={(d) => {
                                                                const next = [...data.family_members];
                                                                next[i] = { ...next[i], dob: d };
                                                                set({ family_members: next });
                                                            }}
                                                            maxDate={new Date().toISOString().split('T')[0]}
                                                            autoSelect={true} />
                                                    </div>
                                                    <div className="col-md-4 mb-3">
                                                        <label className="form-label">Passport Number</label>
                                                        <input type="text" className="form-control" value={row.passport_number}
                                                            onChange={(e) => {
                                                                const next = [...data.family_members];
                                                                next[i] = { ...next[i], passport_number: e.target.value };
                                                                set({ family_members: next });
                                                            }} />
                                                    </div>
                                                    <div className="col-md-4 mb-3">
                                                        <label className="form-label">ID Number</label>
                                                        <input type="text" className="form-control" value={row.id_number}
                                                            onChange={(e) => {
                                                                const next = [...data.family_members];
                                                                next[i] = { ...next[i], id_number: e.target.value };
                                                                set({ family_members: next });
                                                            }} />
                                                    </div>
                                                    <div className="col-md-4 mb-3 d-flex align-items-end">
                                                        {data.family_members.length > 1 && (
                                                            <button type="button" className="btn btn-danger w-100"
                                                                onClick={() => set({ family_members: data.family_members.filter((_, x) => x !== i) })}>
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="card-footer d-flex justify-content-between">
                                    <button type="button" className="btn btn-light" disabled={step === 1} onClick={() => setStep(step - 1)}>
                                        Previous
                                    </button>
                                    {step < 4 ? (
                                        <button type="button" className="btn btn-primary" onClick={handleNext} disabled={processing}>
                                            {processing ? 'Validating...' : 'Next'}
                                        </button>
                                    ) : (
                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                            {processing ? 'Creating...' : 'Create Client'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
