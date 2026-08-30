import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import DatePicker from '@/components/DatePicker';

type Education = { name: string; photo: File | null };
type TaxDeduction = { name: string; value: string; type: string };
type StaffDoc = { document_name: string; document_type: string; file: File | null };

const STEPS = ['1. Profile', '2. Address', '3. Emergency Contact', '4. Passport & Visa', '5. Payment', '6. Education', '7. Tax & Deduction', '8. Documents'];

export default function StaffCreate() {
    const { zipCodes, addressData, currencies } = usePage().props as any;
    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [skillInput, setSkillInput] = useState('');

    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        profile_pic: null as File | null,
        password: '',
        dob: '',
        joining_date: '',
        passport_number: '',
        country: '',
        zip_code_id: '',
        address_id: '',
        street_id: '',
        county: '',
        city: '',
        address_name: '',
        skills: [] as string[],
        salary: '',
        salary_type: 'per_month',
        currency: 'INR',
        bank_name: '',
        account_number: '',
        ifsc_code: '',
        place_of_issue: '',
        date_of_issue: '',
        expiry_date: '',
        front_image: null as File | null,
        back_image: null as File | null,
        is_foreigner: false,
        visa_type: '',
        visa_number: '',
        visa_expiry_date: '',
        educations: [{ name: '', photo: null }] as Education[],
        tax_deductions: [{ name: '', value: '', type: 'tax' }] as TaxDeduction[],
        documents: [{ document_name: '', document_type: '', file: null }] as StaffDoc[],
        emergency_contact_name: '',
        emergency_relationship: '',
        emergency_phone: '',
        emergency_alternate_phone: '',
        emergency_address: '',
    });

    const set = (patch: Partial<typeof data>) => setData({ ...data, ...patch });

    const clearError = (key: string) => {
        if (errors[key]) {
            const next = { ...errors };
            delete next[key];
            setErrors(next);
        }
    };

    const addSkill = () => {
        const value = skillInput.trim();
        if (value && !data.skills.includes(value)) {
            set({ skills: [...data.skills, value] });
        }
        setSkillInput('');
    };

    const appendRows = (formData: FormData) => {
        data.educations.forEach((row, i) => {
            if (row.name) formData.append(`educations[${i}][name]`, row.name);
            if (row.photo) formData.append(`educations[${i}][photo]`, row.photo);
        });
        data.tax_deductions.forEach((row, i) => {
            if (row.name) {
                formData.append(`tax_deductions[${i}][name]`, row.name);
                formData.append(`tax_deductions[${i}][value]`, row.value || '0');
                formData.append(`tax_deductions[${i}][type]`, row.type);
            }
        });
        data.documents.forEach((row, i) => {
            if (row.document_name) formData.append(`documents[${i}][document_name]`, row.document_name);
            if (row.document_type) formData.append(`documents[${i}][document_type]`, row.document_type);
            if (row.file) formData.append(`documents[${i}][file]`, row.file);
        });
    };

    const appendProfile = (formData: FormData) => {
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        if (data.profile_pic) formData.append('profile_pic', data.profile_pic);
        formData.append('password', data.password);
        formData.append('dob', data.dob);
        formData.append('joining_date', data.joining_date);
        data.skills.forEach((s) => formData.append('skills[]', s));
    };

    const appendAddress = (formData: FormData) => {
        formData.append('country', data.country);
        formData.append('zip_code_id', data.zip_code_id);
        formData.append('address_id', data.address_id);
        formData.append('street_id', data.street_id);
        formData.append('county', data.county);
        formData.append('city', data.city);
        formData.append('address', data.address_name);
    };

    const appendPayment = (formData: FormData) => {
        formData.append('salary', data.salary);
        formData.append('salary_type', data.salary_type);
        formData.append('currency', data.currency);
        formData.append('bank_name', data.bank_name);
        formData.append('account_number', data.account_number);
        formData.append('ifsc_code', data.ifsc_code);
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

    const appendEmergency = (formData: FormData) => {
        formData.append('emergency_contact_name', data.emergency_contact_name);
        formData.append('emergency_relationship', data.emergency_relationship);
        formData.append('emergency_phone', data.emergency_phone);
        formData.append('emergency_alternate_phone', data.emergency_alternate_phone);
        formData.append('emergency_address', data.emergency_address);
    };

    const handleNext = async () => {
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('step', step.toString());

        if (step === 1) appendProfile(formData);
        else if (step === 2) appendAddress(formData);
        else if (step === 3) appendEmergency(formData);
        else if (step === 4) appendPassport(formData);
        else if (step === 5) appendPayment(formData);
        else appendRows(formData);

        try {
            const response = await axios.post('/admin/staff/validate-step', formData);
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
        appendProfile(formData);
        appendAddress(formData);
        appendPayment(formData);
        appendPassport(formData);
        appendRows(formData);
        appendEmergency(formData);

        router.post('/admin/staff', formData, {
            onSuccess: () => {
                setSuccessMessage('Staff member created successfully!');
                setTimeout(() => router.visit('/admin/staff'), 1500);
            },
            onError: (err) => {
                setErrors(err as Record<string, string>);
                setProcessing(false);
            },
        });
    };

    const zipObj = addressData?.find((z: any) => z.id === data.zip_code_id);
    const addrObj = zipObj?.addresses?.find((a: any) => a.id === data.address_id);

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Add Staff Member</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/staff">Staff Management</a></li>
                        <li className="breadcrumb-item active">Create</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-xl-3">
                    <div className="card h-auto">
                        <div className="card-body py-sm-5">
                            <div className="text-center">
                                {data.profile_pic ? (
                                    <img
                                        src={URL.createObjectURL(data.profile_pic)}
                                        alt="Staff"
                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid #ddd' }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto"
                                        style={{ width: 80, height: 80 }}
                                    >
                                        <span className="text-primary fw-bold fs-24">
                                            {data.name ? data.name.charAt(0).toUpperCase() : 'S'}
                                        </span>
                                    </div>
                                )}
                                <div className="clearfix mt-3">
                                    <h6 className="mb-0">{data.name || 'Staff Name'}</h6>
                                    <span className="text-muted">Staff</span>
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
                                <span className="text-muted">Salary</span>
                                <span>{data.salary ? `${data.currency} ${data.salary}` : '—'}</span>
                            </li>
                        </ul>

                        <div className="card-footer p-4">
                            <a href="/admin/staff" className="btn btn-outline-primary w-100">Back To List</a>
                        </div>
                    </div>
                </div>

                <div className="col-xl-9">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="card-title mb-0">Staff Setup</h6>
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
                                {/* ── Step 1: Profile ───────────────────────────── */}
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
                                            <DatePicker
                                                label="Date of Birth"
                                                value={data.dob}
                                                onChange={(date) => { set({ dob: date }); clearError('dob'); }}
                                                maxDate={new Date().toISOString().split('T')[0]}
                                                autoSelect={true}
                                            />
                                            {errors.dob && <div className="invalid-feedback d-block">{errors.dob}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <DatePicker
                                                label="Joining Date"
                                                value={data.joining_date}
                                                onChange={(date) => { set({ joining_date: date }); clearError('joining_date'); }}
                                                maxDate={new Date().toISOString().split('T')[0]}
                                                autoSelect={true}
                                            />
                                            {errors.joining_date && <div className="invalid-feedback d-block">{errors.joining_date}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Photo</label>
                                            <input type="file" className={`form-control ${errors.profile_pic ? 'is-invalid' : ''}`} accept="image/*"
                                                onChange={(e) => { set({ profile_pic: e.target.files?.[0] || null }); clearError('profile_pic'); }} />
                                            {errors.profile_pic && <div className="invalid-feedback d-block">{errors.profile_pic}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Password</label>
                                            <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={data.password}
                                                onChange={(e) => { set({ password: e.target.value }); clearError('password'); }} />
                                            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                                        </div>

                                        <div className="col-12"><hr /><h6 className="mb-3">Skills</h6></div>

                                        <div className="col-12 mb-4">
                                            {data.skills.length > 0 && (
                                                <div className="mb-2 d-flex flex-wrap gap-2">
                                                    {data.skills.map((skill) => (
                                                        <span key={skill} className="badge bg-primary d-inline-flex align-items-center">
                                                            {skill}
                                                            <button type="button" className="btn-close btn-close-white ms-2" style={{ fontSize: 10 }}
                                                                onClick={() => set({ skills: data.skills.filter((s) => s !== skill) })} />
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Type a skill and press Add"
                                                    value={skillInput}
                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
                                                <button type="button" className="btn btn-primary" onClick={addSkill}>Add</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 2: Address ───────────────────────────── */}
                                {step === 2 && (
                                    <div className="row">
                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Zip Code</label>
                                            <select className={`form-select ${errors.zip_code_id ? 'is-invalid' : ''}`} value={data.zip_code_id}
                                                onChange={(e) => {
                                                    const zip = addressData?.find((z: any) => z.id === e.target.value);
                                                    set({
                                                        zip_code_id: e.target.value,
                                                        address_id: '',
                                                        street_id: '',
                                                        country: zip?.country || '',
                                                        county: zip?.county || '',
                                                        city: zip?.city || '',
                                                    });
                                                    clearError('zip_code_id');
                                                }}>
                                                <option value="">-- Select Zip Code --</option>
                                                {zipCodes && Object.entries(zipCodes).map(([id, name]: [string, any]) => (
                                                    <option key={id} value={id}>{String(name)}</option>
                                                ))}
                                            </select>
                                            {errors.zip_code_id && <div className="invalid-feedback d-block">{errors.zip_code_id}</div>}
                                        </div>

                                        {data.zip_code_id && (
                                            <div className="col-sm-6 mb-4">
                                                <label className="form-label">Address</label>
                                                <select className={`form-select ${errors.address_id ? 'is-invalid' : ''}`} value={data.address_id}
                                                    onChange={(e) => {
                                                        set({ address_id: e.target.value, street_id: '', address_name: e.target.options[e.target.selectedIndex].text });
                                                        clearError('address_id');
                                                    }}>
                                                    <option value="">-- Select Address --</option>
                                                    {zipObj?.addresses?.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                                                </select>
                                                {errors.address_id && <div className="invalid-feedback d-block">{errors.address_id}</div>}
                                            </div>
                                        )}

                                        {data.address_id && (
                                            <div className="col-sm-6 mb-4">
                                                <label className="form-label">Street</label>
                                                <select className={`form-select ${errors.street_id ? 'is-invalid' : ''}`} value={data.street_id}
                                                    onChange={(e) => { set({ street_id: e.target.value }); clearError('street_id'); }}>
                                                    <option value="">-- Select Street --</option>
                                                    {addrObj?.streets?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                </select>
                                                {errors.street_id && <div className="invalid-feedback d-block">{errors.street_id}</div>}
                                            </div>
                                        )}

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Country</label>
                                            <input type="text" className={`form-control ${errors.country ? 'is-invalid' : ''}`} value={data.country} disabled style={{ backgroundColor: '#e9ecef' }} />
                                            {errors.country && <div className="invalid-feedback d-block">{errors.country}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">County</label>
                                            <input type="text" className="form-control" value={data.county} disabled style={{ backgroundColor: '#e9ecef' }} />
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 5: Payment ───────────────────────────── */}
                                {step === 5 && (
                                    <div className="row">
                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Salary (Rupees)</label>
                                            <input type="number" step="0.01" className={`form-control ${errors.salary ? 'is-invalid' : ''}`} value={data.salary}
                                                onChange={(e) => { set({ salary: e.target.value }); clearError('salary'); }} />
                                            {errors.salary && <div className="invalid-feedback d-block">{errors.salary}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Salary Type</label>
                                            <select className="form-select" value={data.salary_type} onChange={(e) => set({ salary_type: e.target.value })}>
                                                <option value="per_month">Per Month</option>
                                                <option value="per_day">Per Day</option>
                                                <option value="per_hour">Per Hour</option>
                                            </select>
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Currency</label>
                                            <select className="form-select" value={data.currency} onChange={(e) => set({ currency: e.target.value })}>
                                                {Object.entries(currencies || {}).map(([code, label]: [string, any]) => (
                                                    <option key={code} value={code}>{code} - {label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Bank Name</label>
                                            <input type="text" className="form-control" value={data.bank_name} onChange={(e) => set({ bank_name: e.target.value })} />
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Account Number</label>
                                            <input type="text" className={`form-control ${errors.account_number ? 'is-invalid' : ''}`} value={data.account_number}
                                                onChange={(e) => { set({ account_number: e.target.value }); clearError('account_number'); }} />
                                            {errors.account_number && <div className="invalid-feedback d-block">{errors.account_number}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">IFSC Code</label>
                                            <input type="text" className={`form-control ${errors.ifsc_code ? 'is-invalid' : ''}`} value={data.ifsc_code}
                                                onChange={(e) => { set({ ifsc_code: e.target.value }); clearError('ifsc_code'); }} />
                                            {errors.ifsc_code && <div className="invalid-feedback d-block">{errors.ifsc_code}</div>}
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 6: Education ─────────────────────────── */}
                                {step === 6 && (
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">Education</h6>
                                            <button type="button" className="btn btn-sm btn-primary"
                                                onClick={() => set({ educations: [...data.educations, { name: '', photo: null }] })}>
                                                <i className="fa fa-plus me-1"></i>Add More
                                            </button>
                                        </div>

                                        {data.educations.map((row, i) => (
                                            <div key={i} className="border rounded p-4 mb-3">
                                                <div className="row">
                                                    <div className="col-md-5 mb-3">
                                                        <label className="form-label">Name</label>
                                                        <input type="text" className="form-control" placeholder="e.g. B.Com, MBA" value={row.name}
                                                            onChange={(e) => {
                                                                const next = [...data.educations];
                                                                next[i] = { ...next[i], name: e.target.value };
                                                                set({ educations: next });
                                                            }} />
                                                    </div>
                                                    <div className="col-md-5 mb-3">
                                                        <label className="form-label">Photo / Certificate</label>
                                                        <input type="file" className="form-control" accept="image/*"
                                                            onChange={(e) => {
                                                                const next = [...data.educations];
                                                                next[i] = { ...next[i], photo: e.target.files?.[0] || null };
                                                                set({ educations: next });
                                                            }} />
                                                    </div>
                                                    <div className="col-md-2 mb-3 d-flex align-items-end">
                                                        {data.educations.length > 1 && (
                                                            <button type="button" className="btn btn-danger w-100"
                                                                onClick={() => set({ educations: data.educations.filter((_, x) => x !== i) })}>
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── Step 7: Tax & Deduction ───────────────────── */}
                                {step === 7 && (
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">Tax &amp; Deduction</h6>
                                            <button type="button" className="btn btn-sm btn-primary"
                                                onClick={() => set({ tax_deductions: [...data.tax_deductions, { name: '', value: '', type: 'tax' }] })}>
                                                <i className="fa fa-plus me-1"></i>Add More
                                            </button>
                                        </div>

                                        {data.tax_deductions.map((row, i) => (
                                            <div key={i} className="border rounded p-4 mb-3">
                                                <div className="row">
                                                    <div className="col-md-4 mb-3">
                                                        <label className="form-label">Name</label>
                                                        <input type="text" className="form-control" placeholder="e.g. PF, TDS" value={row.name}
                                                            onChange={(e) => {
                                                                const next = [...data.tax_deductions];
                                                                next[i] = { ...next[i], name: e.target.value };
                                                                set({ tax_deductions: next });
                                                            }} />
                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <label className="form-label">Value</label>
                                                        <input type="number" step="0.01" className="form-control" value={row.value}
                                                            onChange={(e) => {
                                                                const next = [...data.tax_deductions];
                                                                next[i] = { ...next[i], value: e.target.value };
                                                                set({ tax_deductions: next });
                                                            }} />
                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <label className="form-label">Type</label>
                                                        <select className="form-select" value={row.type}
                                                            onChange={(e) => {
                                                                const next = [...data.tax_deductions];
                                                                next[i] = { ...next[i], type: e.target.value };
                                                                set({ tax_deductions: next });
                                                            }}>
                                                            <option value="tax">Tax</option>
                                                            <option value="deduction">Deduction</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-2 mb-3 d-flex align-items-end">
                                                        {data.tax_deductions.length > 1 && (
                                                            <button type="button" className="btn btn-danger w-100"
                                                                onClick={() => set({ tax_deductions: data.tax_deductions.filter((_, x) => x !== i) })}>
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── Step 8: Documents ─────────────────────────── */}
                                {step === 8 && (
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">Documents</h6>
                                            <button type="button" className="btn btn-sm btn-primary"
                                                onClick={() => set({ documents: [...data.documents, { document_name: '', document_type: '', file: null }] })}>
                                                <i className="fa fa-plus me-1"></i>Add More
                                            </button>
                                        </div>

                                        {data.documents.map((row, i) => (
                                            <div key={i} className="border rounded p-4 mb-3">
                                                <div className="row">
                                                    <div className="col-md-4 mb-3">
                                                        <label className="form-label">Document Name</label>
                                                        <input type="text" className="form-control" placeholder="Certificate, License" value={row.document_name}
                                                            onChange={(e) => {
                                                                const next = [...data.documents];
                                                                next[i] = { ...next[i], document_name: e.target.value };
                                                                set({ documents: next });
                                                            }} />
                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <label className="form-label">Document Type</label>
                                                        <select className="form-select" value={row.document_type}
                                                            onChange={(e) => {
                                                                const next = [...data.documents];
                                                                next[i] = { ...next[i], document_type: e.target.value };
                                                                set({ documents: next });
                                                            }}>
                                                            <option value="">Select Type</option>
                                                            <option value="certificate">Certificate</option>
                                                            <option value="license">License</option>
                                                            <option value="resume">Resume</option>
                                                            <option value="id">ID Proof</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <label className="form-label">Upload File</label>
                                                        <input type="file" className="form-control" accept=".pdf,.doc,.docx,image/*"
                                                            onChange={(e) => {
                                                                const next = [...data.documents];
                                                                next[i] = { ...next[i], file: e.target.files?.[0] || null };
                                                                set({ documents: next });
                                                            }} />
                                                    </div>
                                                    <div className="col-md-2 mb-3 d-flex align-items-end">
                                                        {data.documents.length > 1 && (
                                                            <button type="button" className="btn btn-danger w-100"
                                                                onClick={() => set({ documents: data.documents.filter((_, x) => x !== i) })}>
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── Step 3: Emergency Contact ─────────────────── */}
                                {step === 3 && (
                                    <div className="row">
                                        <div className="col-12"><h6 className="mb-3">Emergency Contact</h6></div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Contact Name</label>
                                            <input type="text" className={`form-control ${errors.emergency_contact_name ? 'is-invalid' : ''}`} value={data.emergency_contact_name}
                                                onChange={(e) => { set({ emergency_contact_name: e.target.value }); clearError('emergency_contact_name'); }} />
                                            {errors.emergency_contact_name && <div className="invalid-feedback d-block">{errors.emergency_contact_name}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Relationship</label>
                                            <input type="text" className={`form-control ${errors.emergency_relationship ? 'is-invalid' : ''}`} value={data.emergency_relationship}
                                                placeholder="Spouse, Parent, Sibling, Friend"
                                                onChange={(e) => { set({ emergency_relationship: e.target.value }); clearError('emergency_relationship'); }} />
                                            {errors.emergency_relationship && <div className="invalid-feedback d-block">{errors.emergency_relationship}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Phone</label>
                                            <input type="text" className={`form-control ${errors.emergency_phone ? 'is-invalid' : ''}`} value={data.emergency_phone}
                                                onChange={(e) => { set({ emergency_phone: e.target.value }); clearError('emergency_phone'); }} />
                                            {errors.emergency_phone && <div className="invalid-feedback d-block">{errors.emergency_phone}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Alternate Phone</label>
                                            <input type="text" className={`form-control ${errors.emergency_alternate_phone ? 'is-invalid' : ''}`} value={data.emergency_alternate_phone}
                                                onChange={(e) => { set({ emergency_alternate_phone: e.target.value }); clearError('emergency_alternate_phone'); }} />
                                            {errors.emergency_alternate_phone && <div className="invalid-feedback d-block">{errors.emergency_alternate_phone}</div>}
                                        </div>

                                        <div className="col-12 mb-4">
                                            <label className="form-label">Address</label>
                                            <textarea className={`form-control ${errors.emergency_address ? 'is-invalid' : ''}`} rows={3} value={data.emergency_address}
                                                onChange={(e) => { set({ emergency_address: e.target.value }); clearError('emergency_address'); }} />
                                            {errors.emergency_address && <div className="invalid-feedback d-block">{errors.emergency_address}</div>}
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 4: Passport & Visa ───────────────────── */}
                                {step === 4 && (
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
                                                    Foreign national (different country / company) — visa required
                                                </label>
                                            </div>
                                            <small className="text-muted">Leave unchecked if same country and same company — no visa details needed.</small>
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

                                <div className="card-footer d-flex justify-content-between">
                                    <button type="button" className="btn btn-light" disabled={step === 1} onClick={() => setStep(step - 1)}>
                                        Previous
                                    </button>
                                    {step < 8 ? (
                                        <button type="button" className="btn btn-primary" onClick={handleNext} disabled={processing}>
                                            {processing ? 'Validating...' : 'Next'}
                                        </button>
                                    ) : (
                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                            {processing ? 'Creating...' : 'Create Staff'}
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
