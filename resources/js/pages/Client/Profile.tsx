import ClientLayout from '@/layouts/client/ClientLayout';

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
    status: string;
    last_login_at: string | null;
    agency: string | null;
    address: { address: string | null; city: string | null; state: string | null; country: string | null; zip_code: string | null } | null;
    passport: Record<string, string | null> | null;
    family_members: { name: string; relation: string | null; dob: string | null; passport_number: string | null }[];
}

const formatDate = (value: string | null | undefined) =>
    value ? new Date(value + (value.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null;

const capitalise = (value: string | null) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : null);

function Field({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="col-sm-6 mb-3">
            <small className="text-muted d-block">{label}</small>
            <strong>{value || '—'}</strong>
        </div>
    );
}

/** My Profile: what the agency holds about the signed-in client. */
export default function ClientProfile({ profile }: { profile: Profile }) {
    const address = profile.address
        ? [profile.address.address, profile.address.city, profile.address.state, profile.address.zip_code, profile.address.country].filter(Boolean).join(', ')
        : null;

    return (
        <ClientLayout title="My Profile">
            <div className="card h-auto mb-4">
                <div className="card-body d-flex align-items-center gap-3 flex-wrap">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                        style={{ width: 70, height: 70, fontSize: 28, background: 'var(--primary, #452B90)' }}
                    >
                        {(profile.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                        <h4 className="mb-1">{profile.name}</h4>
                        <div className="d-flex gap-2 flex-wrap">
                            {profile.cid && <span className="badge bg-primary bg-opacity-10 text-primary">{profile.cid}</span>}
                            {profile.nationality && <span className="badge bg-info bg-opacity-10 text-info">{profile.nationality}</span>}
                        </div>
                    </div>
                    {profile.last_login_at && (
                        <div className="text-end">
                            <small className="text-muted d-block">Last signed in</small>
                            <strong>{new Date(profile.last_login_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
                        </div>
                    )}
                </div>
            </div>

            <div className="row">
                <div className="col-xl-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header"><h6 className="card-title mb-0">Personal Details</h6></div>
                        <div className="card-body row">
                            <Field label="First name" value={profile.first_name} />
                            <Field label="Last name" value={profile.last_name} />
                            <Field label="Date of birth" value={formatDate(profile.dob)} />
                            <Field label="Gender" value={capitalise(profile.gender)} />
                            <Field label="Nationality" value={profile.nationality} />
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header"><h6 className="card-title mb-0">Contact</h6></div>
                        <div className="card-body row">
                            <Field label="Email" value={profile.email} />
                            <Field label="Phone" value={profile.phone} />
                            <div className="col-12 mb-3">
                                <small className="text-muted d-block">Address</small>
                                <strong>{address || '—'}</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header"><h6 className="card-title mb-0">Passport</h6></div>
                        <div className="card-body row">
                            {profile.passport ? (
                                <>
                                    <Field label="Passport number" value={profile.passport.passport_number} />
                                    <Field label="Place of issue" value={profile.passport.place_of_issue} />
                                    <Field label="Date of issue" value={formatDate(profile.passport.date_of_issue)} />
                                    <Field label="Expiry date" value={formatDate(profile.passport.expiry_date)} />
                                </>
                            ) : (
                                <p className="text-muted mb-0">No passport details on file.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header"><h6 className="card-title mb-0">Family Members</h6></div>
                        <div className="card-body">
                            {profile.family_members.length ? (
                                <ul className="list-group list-group-flush">
                                    {profile.family_members.map((m, i) => (
                                        <li key={i} className="list-group-item px-0 d-flex justify-content-between">
                                            <span>{m.name}</span>
                                            <span className="text-muted">{capitalise(m.relation) ?? 'Member'}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted mb-0">No family members on file.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-muted text-center small">To change any of these details, please contact {profile.agency ?? 'your agency'}.</p>
        </ClientLayout>
    );
}
