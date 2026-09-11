import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import MasterLayout from '@/layouts/backend/MasterLayout';
import DatePicker from '@/components/DatePicker';
import { isExpiringSoon } from '@/lib/utils';

type Education = { name: string; photo: File | null };
type StaffDoc = { document_name: string; document_type: string; file: File | null };

const STEPS = ['1. Profile', '2. Address', '3. Emergency Contact', '4. Passport & Visa', '5. Education', '6. Documents'];

export default function ProfileEditDetails() {
    const { staff, zipCodes, addressData } = usePage().props as any;
    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');

    const profile = staff?.staff_profile;
    const passport = staff?.staff_passport;
    const emergency = staff?.staff_emergency_contact;

    const [data, setData] = useState({
        name: staff?.name || '',
        phone: staff?.phone || '',
        profile_pic: null as File | null,

        country: profile?.country || '',
        zip_code_id: profile?.zip_code_id || '',
        address_id: profile?.address_id || '',
        street_id: profile?.street_id || '',
        county: profile?.county || '',
        city: profile?.city || '',
        address_name: profile?.address || '',

        emergency_contact_name: emergency?.contact_name || '',
        emergency_relationship: emergency?.relationship || '',
        emergency_phone: emergency?.phone || '',
        emergency_alternate_phone: emergency?.alternate_phone || '',
        emergency_address: emergency?.address || '',

        passport_number: passport?.passport_number || '',
        place_of_issue: passport?.place_of_issue || '',
        date_of_issue: passport?.date_of_issue ? String(passport.date_of_issue).slice(0, 10) : '',
        expiry_date: passport?.expiry_date ? String(passport.expiry_date).slice(0, 10) : '',
        front_image: null as File | null,
        back_image: null as File | null,
        is_foreigner: Boolean(passport?.is_foreigner),
        visa_type: passport?.visa_type || '',
        visa_number: passport?.visa_number || '',
        visa_expiry_date: passport?.visa_expiry_date ? String(passport.visa_expiry_date).slice(0, 10) : '',

        educations: [{ name: '', photo: null }] as Education[],
        documents: [{ document_name: '', document_type: '', file: null }] as StaffDoc[],
    });

    const set = (patch: Partial<typeof data>) => setData({ ...data, ...patch });

    const clearError = (key: string) => {
        if (errors[key]) {
            const next = { ...errors };
            delete next[key];
            setErrors(next);
        }
    };

    const zipObj = addressData?.find((z: any) => z.id === data.zip_code_id);
    const addrObj = zipObj?.addresses?.find((a: any) => a.id === data.address_id);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('phone', data.phone);
        if (data.profile_pic) formData.append('profile_pic', data.profile_pic);

        formData.append('country', data.country);
        formData.append('zip_code_id', data.zip_code_id);
        formData.append('address_id', data.address_id);
        formData.append('street_id', data.street_id);
        formData.append('county', data.county);
        formData.append('city', data.city);
        formData.append('address', data.address_name);

        formData.append('emergency_contact_name', data.emergency_contact_name);
        formData.append('emergency_relationship', data.emergency_relationship);
        formData.append('emergency_phone', data.emergency_phone);
        formData.append('emergency_alternate_phone', data.emergency_alternate_phone);
        formData.append('emergency_address', data.emergency_address);

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

        data.educations.forEach((row, i) => {
            if (row.name) formData.append(`educations[${i}][name]`, row.name);
            if (row.photo) formData.append(`educations[${i}][photo]`, row.photo);
        });
        data.documents.forEach((row, i) => {
            if (row.document_name) formData.append(`documents[${i}][document_name]`, row.document_name);
            if (row.document_type) formData.append(`documents[${i}][document_type]`, row.document_type);
            if (row.file) formData.append(`documents[${i}][file]`, row.file);
        });

        router.put('/profile/edit-details', formData, {
            onSuccess: () => setSuccessMessage('Profile updated successfully!'),
            onError: (err) => {
                setErrors(err as Record<string, string>);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <MasterLayout title="Edit Profile">
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Edit Profile</h1></li>
                        <li className="breadcrumb-item"><a href="/profile/overview">Profile</a></li>
                        <li className="breadcrumb-item active">Edit Details</li>
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
                                        alt="Profile"
                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid #ddd' }}
                                    />
                                ) : (staff?.profile_image_url || staff?.profile_pic) ? (
                                    <img
                                        src={staff.profile_image_url || staff.profile_pic}
                                        alt="Profile"
                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid #ddd' }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto"
                                        style={{ width: 80, height: 80 }}
                                    >
                                        <span className="text-primary fw-bold fs-24">
                                            {staff?.name ? staff.name.charAt(0).toUpperCase() : 'S'}
                                        </span>
                                    </div>
                                )}
                                <div className="clearfix mt-3">
                                    <h6 className="mb-0">{staff?.name}</h6>
                                    <span className="text-muted">{staff?.email}</span>
                                </div>
                            </div>
                        </div>

                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between py-3">
                                <span className="text-muted">Email</span>
                                <span className="text-truncate ms-2" style={{ maxWidth: 140 }}>{staff?.email || '—'}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between py-3">
                                <span className="text-muted">Phone</span>
                                <span>{staff?.phone || '—'}</span>
                            </li>
                        </ul>

                        <div className="card-footer p-4">
                            <a href="/profile/overview" className="btn btn-outline-primary w-100">Back To Overview</a>
                        </div>
                    </div>
                </div>

                <div className="col-xl-9">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="card-title mb-0">Edit Profile</h6>
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
                                            <label className="form-label">Email <small className="text-muted">(contact an admin to change)</small></label>
                                            <input type="email" className="form-control" value={staff?.email || ''} disabled style={{ backgroundColor: '#e9ecef' }} />
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Phone</label>
                                            <input type="text" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={data.phone}
                                                onChange={(e) => { set({ phone: e.target.value }); clearError('phone'); }} />
                                            {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Date of Birth <small className="text-muted">(contact an admin to change)</small></label>
                                            <input type="text" className="form-control" value={profile?.dob ? String(profile.dob).slice(0, 10) : ''} disabled style={{ backgroundColor: '#e9ecef' }} />
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Joining Date <small className="text-muted">(contact an admin to change)</small></label>
                                            <input type="text" className="form-control" value={profile?.joining_date ? String(profile.joining_date).slice(0, 10) : ''} disabled style={{ backgroundColor: '#e9ecef' }} />
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Photo <small className="text-muted">(leave empty to keep current)</small></label>
                                            <input type="file" className={`form-control ${errors.profile_pic ? 'is-invalid' : ''}`} accept="image/*"
                                                onChange={(e) => { set({ profile_pic: e.target.files?.[0] || null }); clearError('profile_pic'); }} />
                                            {errors.profile_pic && <div className="invalid-feedback d-block">{errors.profile_pic}</div>}
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
                                            <input type="text" className="form-control" value={data.country} disabled style={{ backgroundColor: '#e9ecef' }} />
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">County</label>
                                            <input type="text" className="form-control" value={data.county} disabled style={{ backgroundColor: '#e9ecef' }} />
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 3: Emergency Contact ─────────────────── */}
                                {step === 3 && (
                                    <div className="row">
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

                                        <div className="col-12 mb-0">
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
                                            {isExpiringSoon(data.expiry_date) && (
                                                <div className="text-warning small mt-1">
                                                    <i className="fa fa-triangle-exclamation me-1"></i>
                                                    This passport expires within 6 months.
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Passport Front <small className="text-muted">(leave empty to keep current)</small></label>
                                            <input type="file" className={`form-control ${errors.front_image ? 'is-invalid' : ''}`} accept="image/*"
                                                onChange={(e) => { set({ front_image: e.target.files?.[0] || null }); clearError('front_image'); }} />
                                            {data.front_image ? (
                                                <img src={URL.createObjectURL(data.front_image)} alt="Passport front preview" className="d-inline-block mt-2" style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                                            ) : passport?.front_image && (
                                                <a href={passport.front_image} target="_blank" rel="noopener noreferrer" className="d-inline-block mt-2">
                                                    <img src={passport.front_image} alt="Passport front" style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                                                </a>
                                            )}
                                            {errors.front_image && <div className="invalid-feedback d-block">{errors.front_image}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Passport Back <small className="text-muted">(leave empty to keep current)</small></label>
                                            <input type="file" className={`form-control ${errors.back_image ? 'is-invalid' : ''}`} accept="image/*"
                                                onChange={(e) => { set({ back_image: e.target.files?.[0] || null }); clearError('back_image'); }} />
                                            {data.back_image ? (
                                                <img src={URL.createObjectURL(data.back_image)} alt="Passport back preview" className="d-inline-block mt-2" style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                                            ) : passport?.back_image && (
                                                <a href={passport.back_image} target="_blank" rel="noopener noreferrer" className="d-inline-block mt-2">
                                                    <img src={passport.back_image} alt="Passport back" style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                                                </a>
                                            )}
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
                                                    {isExpiringSoon(data.visa_expiry_date) && (
                                                        <div className="text-warning small mt-1">
                                                            <i className="fa fa-triangle-exclamation me-1"></i>
                                                            This visa expires within 6 months.
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* ── Step 5: Education ──────────────────────────── */}
                                {step === 5 && (
                                    <div>
                                        {staff?.staff_educations?.length > 0 && (
                                            <div className="mb-4">
                                                <h6 className="mb-3 text-primary">Existing Education</h6>
                                                <table className="table table-sm">
                                                    <thead><tr><th>Photo</th><th>Name</th><th>Action</th></tr></thead>
                                                    <tbody>
                                                        {staff.staff_educations.map((row: any) => (
                                                            <tr key={row.id}>
                                                                <td>{row.photo
                                                                    ? <img src={row.photo} alt={row.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                                                                    : <span className="text-muted small">—</span>}</td>
                                                                <td>{row.name}</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-sm btn-danger"
                                                                        onClick={() => {
                                                                            if (confirm('Delete this education record?')) {
                                                                                router.delete(`/profile/educations/${row.id}`, { onSuccess: () => router.reload() });
                                                                            }
                                                                        }}>
                                                                        <i className="fa fa-trash"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <hr />
                                            </div>
                                        )}

                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">Add Education</h6>
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
                                                        {row.photo && (
                                                            <img src={URL.createObjectURL(row.photo)} alt="Preview" className="d-block mt-2" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                                                        )}
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

                                {/* ── Step 6: Documents ─────────────────────────── */}
                                {step === 6 && (
                                    <div>
                                        {staff?.staff_documents?.length > 0 && (
                                            <div className="mb-4">
                                                <h6 className="mb-3 text-primary">Existing Documents</h6>
                                                <table className="table table-sm">
                                                    <thead><tr><th>Name</th><th>Type</th><th>File</th><th>Action</th></tr></thead>
                                                    <tbody>
                                                        {staff.staff_documents.map((row: any) => (
                                                            <tr key={row.id}>
                                                                <td>{row.document_name}</td>
                                                                <td><span className="badge bg-info">{row.document_type || '—'}</span></td>
                                                                <td className="text-uppercase small">{row.file_type || '—'}</td>
                                                                <td>
                                                                    <div className="d-flex gap-2">
                                                                        {row.file_path && (
                                                                            <a href={row.file_path} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                                                                                <i className="fa fa-download"></i>
                                                                            </a>
                                                                        )}
                                                                        <button type="button" className="btn btn-sm btn-danger"
                                                                            onClick={() => {
                                                                                if (confirm('Delete this document?')) {
                                                                                    router.delete(`/profile/documents/${row.id}`, { onSuccess: () => router.reload() });
                                                                                }
                                                                            }}>
                                                                            <i className="fa fa-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <hr />
                                            </div>
                                        )}

                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">Add Documents</h6>
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

                                <div className="d-flex justify-content-between mt-4">
                                    <button type="button" className="btn btn-light" disabled={step === 1} onClick={() => setStep(step - 1)}>
                                        Previous
                                    </button>
                                    {step < STEPS.length ? (
                                        <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
                                            Next
                                        </button>
                                    ) : (
                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
}
