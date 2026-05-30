import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Service {
    id: number;
    user_id: number;
    service_name: string;
    status: string;
}

interface Props {
    agency: any;
}

const serviceIcons: { [key: string]: string } = {
    'Flight Booking': 'fa-plane',
    'Hotel Booking': 'fa-hotel',
    'Tour Packages': 'fa-map',
    'Visa Assistance': 'fa-passport',
    'Car Rental': 'fa-car',
    'Travel Insurance': 'fa-shield',
};

export default function AgencyService({ agency }: Props) {
    const [services, setServices] = useState<Service[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmServiceId, setConfirmServiceId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        status: 'Active',
    });

    const availableServices = [
        'Flight Booking',
        'Hotel Booking',
        'Tour Packages',
        'Visa Assistance',
        'Car Rental',
        'Travel Insurance',
    ];

    // Load services from API
    useEffect(() => {
        loadServices();
    }, [agency.user_id]);

    const loadServices = async () => {
        try {
            const response = await fetch(`/api/users/${agency.user_id}/services`);
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error loading services:', error);
        }
    };

    const handleRemoveService = (serviceId: number) => {
        setConfirmServiceId(serviceId);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!confirmServiceId) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/users/${agency.user_id}/services/${confirmServiceId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setServices(services.filter(s => s.id !== confirmServiceId));
                toast.success('Service removed successfully!');
                setShowConfirm(false);
                setConfirmServiceId(null);
            } else {
                toast.error('Error removing service');
            }
        } catch (error) {
            console.error('Error removing service:', error);
            toast.error('Error removing service');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleServiceToggle = (serviceName: string) => {
        setSelectedServices(prev =>
            prev.includes(serviceName)
                ? prev.filter(s => s !== serviceName)
                : [...prev, serviceName]
        );
    };

    /**
     * Handle adding selected services for the agency
     */
    const handleAddServices = async () => {
        if (selectedServices.length === 0) {
            toast.error('Please select at least one service');
            return;
        }

        setIsLoading(true);
        try {
            const newServices: Service[] = [];

            for (const serviceName of selectedServices) {
                const response = await fetch(`/api/users/${agency.user_id}/services`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        service_name: serviceName,
                        status: formData.status,
                    }),
                });

                if (response.ok) {
                    const newService = await response.json();
                    newServices.push(newService);
                } else {
                    const errorData = await response.json();
                    console.error('Failed to add service:', errorData);
                    toast.error(errorData.error || `Error adding ${serviceName}`);
                }
            }

            if (newServices.length > 0) {
                setServices([...services, ...newServices]);
                setSelectedServices([]);
                setFormData({ status: 'Active' });
                setShowModal(false);
                toast.success(`${newServices.length} service(s) added successfully!`);
            } else if (newServices.length === 0 && selectedServices.length > 0) {
                toast.error('Could not add any services');
            }
        } catch (error) {
            console.error('Error adding services:', error);
            toast.error('Error adding services');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="row g-4 px-4">
            <div className="col-lg-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Services</h5>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                        <i className="fa-solid fa-plus me-1"></i> Add Service
                    </button>
                </div>

                <div className="row">
                    {services.map((service) => (
                        <div key={service.id} className="col-md-6 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 className="card-title mb-1">
                                                <i className={`fa-solid ${serviceIcons[service.service_name] || 'fa-star'} me-2 text-primary`}></i>
                                                {service.service_name}
                                            </h6>
                                            <small className="text-muted">Service Type</small>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className={`badge badge-sm ${service.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                                                {service.status}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveService(service.id)}
                                                className="btn btn-sm btn-link text-danger p-0"
                                                title="Remove service"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Service Modal */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Services</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedServices([]);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Select Services (you can select multiple)</label>
                                    <div className="row g-2">
                                        {availableServices
                                            .filter(serviceName => !services.some(s => s.service_name === serviceName))
                                            .map((serviceName) => (
                                                <div key={serviceName} className="col-md-6">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleServiceToggle(serviceName)}
                                                        className={`w-100 p-3 border rounded text-start ${
                                                            selectedServices.includes(serviceName)
                                                                ? 'border-primary bg-primary bg-opacity-10'
                                                                : 'border-secondary'
                                                        }`}
                                                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                                    >
                                                        <i className={`fa-solid ${selectedServices.includes(serviceName) ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                                                        <i className={`fa-solid ${serviceIcons[serviceName]} me-2 text-primary`}></i>
                                                        {serviceName}
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                    {availableServices.every(serviceName => services.some(s => s.service_name === serviceName)) && (
                                        <p className="text-muted mt-3 mb-0">All services are already assigned.</p>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedServices([]);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddServices}
                                    disabled={selectedServices.length === 0 || isLoading}
                                >
                                    <i className="fa-solid fa-check me-1"></i> {isLoading ? 'Adding...' : `Add ${selectedServices.length > 0 ? `(${selectedServices.length})` : 'Services'}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Service"
                message="Are you sure you want to delete this service? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setShowConfirm(false);
                    setConfirmServiceId(null);
                }}
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />

            {/* Toast Notifications */}
            <Toaster position="top-right" />
        </div>
    );
}
