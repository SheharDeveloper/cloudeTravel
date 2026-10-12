import { useState } from 'react';
import { router } from '@inertiajs/react';
import ClientLayout from '@/layouts/client/ClientLayout';
import DatePicker from '@/components/DatePicker';
import { latestBirthDate } from '@/lib/age';

interface Profile {
    cid: string | null;
    name: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    nationality: string | null;
    gender: string | null;
    dob: string | null;
    agency: string | null;
    address: { address: string | null; city: string | null; state: string | null; country: string | null; zip_code: string | null } | null;
}

type ProfileForm = {
    first_name: string;
    last_name: string;
    phone: string;
    nationality: string;
    gender: string;
    dob: string;
    address: { address: string; city: string; state: string; country: string; zip_code: string };
};

/**
 * Profile Settings (like the staff Profile Settings): the client's card,
 * their details and address, and Change Password — all on one page.
 */
export default function ClientSettings({ profile }: { profile: Profile }) {
    // ── Profile ──
    const [data, setData] = useState<ProfileForm>({
        first_name: profile.first_name ?? '',
        last_name: profile.last_name ?? '',
        phone: profile.phone ?? '',
        nationality: profile.nationality ?? '',
        gender: profile.gender ?? '',
        dob: profile.dob ?? '',
        address: {
            address: profile.address?.address ?? '',
            city: profile.address?.city ?? '',
            state: profile.address?.state ?? '',
            country: profile.address?.country ?? '',
            zip_code: profile.address?.zip_code ?? '',
        },
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

    const set = (field: Exclude<keyof ProfileForm, 'address'>, value: string) => setData((d) => ({ ...d, [field]: value }));
    const setAddress = (field: keyof ProfileForm['address'], value: string) => setData((d) => ({ ...d, address: { ...d.address, [field]: value } }));

    const saveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileErrors({});
        router.put('/client/profile', { ...data, gender: data.gender || null, dob: data.dob || null }, {
            preserveScroll: true,
            onError: (errs) => setProfileErrors(errs as Record<string, string>),
            onFinish: () => setSavingProfile(false),
        });
    };

    // ── Change Password ──
    const [current, setCurrent] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

    const savePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setSavingPassword(true);
        setPasswordErrors({});
        router.put('/client/password', { current_password: current, password, password_confirmation: confirm }, {
            preserveScroll: true,
            onSuccess: () => { setCurrent(''); setPassword(''); setConfirm(''); },
            onError: (errs) => setPasswordErrors(errs as Record<string, string>),
            onFinish: () => setSavingPassword(false),
        });
    };

    const input = (label: string, name: Exclude<keyof ProfileForm, 'address'>, col = 'col-md-6', props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
        <div className={`${col} mb-3`}>
            <label className="form-label" htmlFor={`f-${name}`}>{label}</label>
            <input id={`f-${name}`} className={`form-control ${profileErrors[name] ? 'is-invalid' : ''}`} value={data[name]} onChange={(e) => set(name, e.target.value)} {...props} />
            {profileErrors[name] && <div className="invalid-feedback d-block">{profileErrors[name]}</div>}
        </div>
    );
    const addressInput = (label: string, name: keyof ProfileForm['address'], col = 'col-md-6') => (
        <div className={`${col} mb-3`}>
            <label className="form-label" htmlFor={`a-${name}`}>{label}</label>
            <input id={`a-${name}`} className={`form-control ${profileErrors[`address.${name}`] ? 'is-invalid' : ''}`} value={data.address[name]} onChange={(e) => setAddress(name, e.target.value)} />
            {profileErrors[`address.${name}`] && <div className="invalid-feedback d-block">{profileErrors[`address.${name}`]}</div>}
        </div>
    );
    const passwordType = showPasswords ? 'text' : 'password';

    return (
        <ClientLayout title="Profile Settings">
            <form onSubmit={saveProfile}>
                <div className="row">
                    {/* The client's card */}
                    <div className="col-xl-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body text-center d-flex flex-column align-items-center justify-content-center py-4">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mb-3"
                                    style={{ width: 120, height: 120, fontSize: 48, background: 'var(--primary, #452B90)' }}
                                >
                                    {(profile.name || '?').charAt(0).toUpperCase()}
                                </div>
                                <h5 className="mb-1">{profile.name}</h5>
                                <small className="text-muted d-block mb-2">{profile.email}</small>
                                {profile.cid && <span className="badge bg-primary bg-opacity-10 text-primary">{profile.cid}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="col-xl-8 mb-4">
                        <div className="card h-100">
                            <div className="card-header"><h6 className="card-title mb-0">Basic Information</h6></div>
                            <div className="card-body row">
                                {input('First Name *', 'first_name', 'col-md-6', { required: true, maxLength: 255 })}
                                {input('Last Name', 'last_name', 'col-md-6', { maxLength: 255 })}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email <span className="text-muted">(Read-only)</span></label>
                                    <input className="form-control" value={profile.email ?? ''} disabled />
                                    <small className="text-muted">You sign in with this email. To change it, contact {profile.agency ?? 'your agency'}.</small>
                                </div>
                                {input('Phone', 'phone', 'col-md-6', { maxLength: 20, inputMode: 'tel' })}
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Date of Birth</label>
                                    <DatePicker value={data.dob} onChange={(v) => set('dob', v)} maxDate={latestBirthDate()} autoSelect={true} />
                                    {profileErrors.dob && <div className="invalid-feedback d-block">{profileErrors.dob}</div>}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label" htmlFor="f-gender">Gender</label>
                                    <select id="f-gender" className="form-select" value={data.gender} onChange={(e) => set('gender', e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                {input('Nationality', 'nationality', 'col-md-4', { maxLength: 100 })}
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                                        <i className={`fa ${savingProfile ? 'fa-spinner fa-spin' : 'fa-save'} me-2`}></i>{savingProfile ? 'Saving…' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <div className="row">
                {/* Address (saved with the profile) */}
                <div className="col-xl-6 mb-4">
                    <form className="card h-100" onSubmit={saveProfile}>
                        <div className="card-header"><h6 className="card-title mb-0">Address</h6></div>
                        <div className="card-body row">
                            {addressInput('Address', 'address', 'col-12')}
                            {addressInput('City', 'city')}
                            {addressInput('State', 'state')}
                            {addressInput('Country', 'country')}
                            {addressInput('Zip Code', 'zip_code')}
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                                    <i className={`fa ${savingProfile ? 'fa-spinner fa-spin' : 'fa-save'} me-2`}></i>{savingProfile ? 'Saving…' : 'Save Address'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Change Password */}
                <div className="col-xl-6 mb-4">
                    <form className="card h-100" onSubmit={savePassword}>
                        <div className="card-header"><h6 className="card-title mb-0">Change Password</h6></div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="current-password">Current Password</label>
                                <input id="current-password" type={passwordType} className={`form-control ${passwordErrors.current_password ? 'is-invalid' : ''}`} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
                                {passwordErrors.current_password && <div className="invalid-feedback d-block">{passwordErrors.current_password}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="new-password">New Password</label>
                                <input id="new-password" type={passwordType} className={`form-control ${passwordErrors.password ? 'is-invalid' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters" />
                                {passwordErrors.password && <div className="invalid-feedback d-block">{passwordErrors.password}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
                                <input id="confirm-password" type={passwordType} className="form-control" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
                            </div>
                            <label className="d-flex align-items-center gap-2 small text-muted mb-3" style={{ cursor: 'pointer' }}>
                                <input type="checkbox" className="form-check-input mt-0" checked={showPasswords} onChange={(e) => setShowPasswords(e.target.checked)} />
                                Show passwords
                            </label>
                            <button type="submit" className="btn btn-primary" disabled={savingPassword || !current || !password || !confirm}>
                                <i className={`fa ${savingPassword ? 'fa-spinner fa-spin' : 'fa-key'} me-2`}></i>{savingPassword ? 'Saving…' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ClientLayout>
    );
}
