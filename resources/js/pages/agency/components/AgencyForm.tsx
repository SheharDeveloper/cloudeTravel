import { useState } from 'react';
import type { Agency, AgencyFormData } from '../types';

interface Props {
    initial?: Agency;
    onSubmit: (data: AgencyFormData) => void;
    onCancel: () => void;
}

export default function AgencyForm({ initial, onSubmit, onCancel }: Props) {
    const [form, setForm] = useState<AgencyFormData>({
        name: initial?.name ?? '',
        email: initial?.email ?? '',
        phone: initial?.phone ?? '',
        status: initial?.status ?? 'Active',
    });

    const [errors, setErrors] = useState<Partial<AgencyFormData>>({});

    const validate = (): boolean => {
        const e: Partial<AgencyFormData> = {};
        if (!form.name.trim()) e.name = 'Agency name is required.';
        if (!form.email.trim()) e.email = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
        if (!form.phone.trim()) e.phone = 'Phone is required.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) onSubmit(form);
    };

    const field = (key: keyof AgencyFormData, label: string, type = 'text') => (
        <div className="mb-3">
            <label className="form-label fw-semibold">{label}</label>
            <input
                type={type}
                className={`form-control${errors[key] ? ' is-invalid' : ''}`}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={`Enter ${label.toLowerCase()}`}
            />
            {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
        </div>
    );

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header border-0 bg-primary bg-opacity-10">
                <h5 className="card-title mb-0 text-primary">
                    <i className={`fa-solid ${initial ? 'fa-pen' : 'fa-plus'} me-2`}></i>
                    {initial ? 'Edit Agency' : 'Add New Agency'}
                </h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="row">
                        <div className="col-md-6">
                            {field('name', 'Agency Name')}
                        </div>
                        <div className="col-md-6">
                            {field('email', 'Email Address', 'email')}
                        </div>
                        <div className="col-md-6">
                            {field('phone', 'Phone Number', 'tel')}
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Status</label>
                                <select
                                    className="form-select"
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value as Agency['status'] })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-2">
                        <button type="submit" className="btn btn-primary">
                            <i className="fa-solid fa-floppy-disk me-1"></i>
                            {initial ? 'Update' : 'Save'}
                        </button>
                        <button type="button" className="btn btn-light" onClick={onCancel}>
                            <i className="fa-solid fa-xmark me-1"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
