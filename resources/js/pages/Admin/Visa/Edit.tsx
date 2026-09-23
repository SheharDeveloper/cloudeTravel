import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { emptyCostDetailRow, toVisaPayload, toastSaveError, validateOnServer, withFormError, type Visa, type VisaFormData } from '@/services/visaService';
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

export default function VisaEdit() {
    const { visa, visaTypes, countries, categories, currency } = usePage().props as unknown as {
        visa: Visa;
        visaTypes: VisaType[];
        countries: Country[];
        categories: Category[];
        currency: { symbol: string };
    };

    const costDetails = visa.cost_details && visa.cost_details.length > 0
        ? visa.cost_details.map(cd => ({
            type: cd.type || '',
            validation_process: cd.validation_process || '',
            processing_time: cd.processing_time || '',
            embassy_fee: cd.embassy_fee || '',
            service_fee: cd.service_fee || '',
            tax_fee: cd.tax_fee || '',
            credit_amount: cd.credit_amount || '',
            tax_amount: cd.tax_amount || '',
        }))
        : [emptyCostDetailRow()];

    const [formData, setFormData] = useState<VisaFormData>({
        visa_type_id: visa.visa_type_id ?? null,
        origin_country_id: visa.origin_country_id ?? null,
        destination_country_id: visa.destination_country_id ?? null,
        visa_service_category_id: visa.visa_service_category_id ?? null,
        name: visa.name || '',
        title: visa.title,
        description: visa.description || '',
        image: null,
        status: Number(visa.status) === 1 ? 1 : 0,
        is_featured: Boolean(visa.is_featured),
        cost_details: costDetails,
    });
    const [preview, setPreview] = useState<string | null>(visa.image || null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = () => {
        setSubmitting(true);
        setErrors({});

        // Multipart bodies only reach PHP on POST, so the update is spoofed as PUT.
        router.post(`/admin/visa-services/${visa.uid}`, { ...toVisaPayload(formData), _method: 'put' }, {
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
                onValidate={(options, callbacks, overrides) => validateOnServer(toVisaPayload({ ...formData, ...overrides }), { ...options, mode: 'edit', visaUid: visa.uid }, callbacks)}
                mode="edit"
                title={`Edit Visa`}
                subtitle={visa.name || visa.title}
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
