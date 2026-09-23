import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { emptyCostDetailRow, toVisaPayload, toastSaveError, validateOnServer, withFormError, type VisaFormData } from '@/services/visaService';
import type { VisaType } from './VisaTypeFormModal';
import VisaWizard from './VisaWizard';

interface Country {
    id: number;
    countryName: string;
    countryCode: string;
    flag_url?: string;
}

interface Category {
    id: number;
    name: string;
}

const emptyFormData: VisaFormData = {
    visa_type_id: null,
    origin_country_id: null,
    destination_country_id: null,
    visa_service_category_id: null,
    name: '',
    title: '',
    description: '',
    image: null,
    status: 1,
    is_featured: true,
    cost_details: [emptyCostDetailRow()],
};

export default function VisaCreate() {
    const { visaTypes, countries, categories, currency } = usePage().props as unknown as {
        visaTypes: VisaType[];
        countries: Country[];
        categories: Category[];
        currency: { symbol: string };
    };

    const [formData, setFormData] = useState<VisaFormData>(emptyFormData);
    const [preview, setPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (asDraft: boolean) => {
        setSubmitting(true);
        setErrors({});

        router.post('/admin/visa-services', toVisaPayload(asDraft ? { ...formData, status: 0 } : formData), {
            forceFormData: true,
            onError: (serverErrors) => {
                setErrors(withFormError(serverErrors));
                toastSaveError(serverErrors);
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <ProtectedRoute>
            <VisaWizard
                onValidate={(options, callbacks, overrides) => validateOnServer(toVisaPayload({ ...formData, ...overrides }), { ...options, mode: 'create' }, callbacks)}
                mode="create"
                title="Add New Visa"
                subtitle="Create a new visa application with all required details"
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                preview={preview}
                setPreview={setPreview}
                visaTypes={visaTypes}
                countries={countries}
                categories={categories}
                currencySymbol={currency?.symbol || '£'}
                submitting={submitting}
                onSubmit={handleSubmit}
            />
        </ProtectedRoute>
    );
}
