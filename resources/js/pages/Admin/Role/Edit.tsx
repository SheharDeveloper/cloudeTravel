import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function RoleEdit() {
    const { role, permissionGroups, errors } = usePage().props as any;
    const [processing, setProcessing] = useState(false);
    const [name, setName] = useState(role?.name || '');
    const [selected, setSelected] = useState<string[]>(role?.permissions || []);

    const groups: Record<string, any[]> = permissionGroups || {};

    const [search, setSearch] = useState('');

    // Filter by permission name or module, dropping modules with no matches
    const q = search.trim().toLowerCase();
    const visibleGroups = Object.entries(groups)
        .map(([module, items]) => [
            module,
            q ? items.filter((i: any) => i.name.toLowerCase().includes(q) || module.toLowerCase().includes(q)) : items,
        ] as [string, any[]])
        .filter(([, items]) => items.length > 0);

    const toggle = (permission: string) => {
        setSelected((prev) =>
            prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
        );
    };

    const toggleModule = (items: any[], allOn: boolean) => {
        const names = items.map((i) => i.name);
        setSelected((prev) =>
            allOn ? prev.filter((p) => !names.includes(p)) : prev.concat(names.filter((n) => !prev.includes(n)))
        );
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        router.put(`/admin/roles/${role.uid}`, { name, permissions: selected }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Edit Role</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/roles">Role Management</a></li>
                        <li className="breadcrumb-item active">Edit</li>
                    </ol>
                </nav>
            </div>

            <form onSubmit={submit}>
                <div className="card h-auto mb-4">
                    <div className="card-header"><h6 className="card-title mb-0">Role Details</h6></div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Role Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors?.name ? 'is-invalid' : ''}`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. manager"
                                />
                                {errors?.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card h-auto mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="card-title mb-0">Permissions</h6>
                        <div className="d-flex align-items-center gap-2">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ width: 220 }}
                                placeholder="Search permissions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        <span className="badge bg-primary">{selected.length} selected</span>
                        </div>
                    </div>
                    <div className="card-body">
                        {Object.keys(groups).length === 0 && (
                            <p className="text-muted mb-0">No permissions found. Run the RolePermissionSeeder.</p>
                        )}

                        {visibleGroups.map(([module, items]) => {
                            const names = items.map((i: any) => i.name);
                            const allOn = names.every((n) => selected.includes(n));

                            return (
                                <div key={module} className="border rounded p-3 mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="mb-0 text-capitalize">{module.replace(/-/g, ' ')}</h6>
                                        <button
                                            type="button"
                                            className={`btn btn-sm ${allOn ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
                                            onClick={() => toggleModule(items, allOn)}
                                        >
                                            {allOn ? 'Clear' : 'Select all'}
                                        </button>
                                    </div>

                                    <div className="d-flex flex-wrap gap-3">
                                        {items.map((p: any) => (
                                            <div className="form-check" key={p.id}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={`p-${p.id}`}
                                                    checked={selected.includes(p.name)}
                                                    onChange={() => toggle(p.name)}
                                                />
                                                <label className="form-check-label text-capitalize" htmlFor={`p-${p.id}`}>
                                                    {p.action}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="card-footer d-flex gap-2">
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Role'}
                        </button>
                        <a href="/admin/roles" className="btn btn-outline-secondary">Cancel</a>
                    </div>
                </div>
            </form>
        </div>
    );
}
