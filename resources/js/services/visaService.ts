import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
export interface VisaCostDetail {
    id: number;
    type: string | null;
    validation_process: string | null;
    processing_time: string | null;
    embassy_fee: string | null;
    service_fee: string | null;
    tax_fee: string | null;
    credit_amount: string | null;
    tax_amount: string | null;
    total_cost: string | null;
}

// Visa data interface
export interface Visa {
    id: number;
    uid: string;
    visa_type_id?: number | null;
    visa_type?: { id: number; name: string; description: string | null } | null;
    origin_country_id?: number | null;
    origin_country?: { id: number; uid?: string; countryName: string; countryCode: string } | null;
    destination_country_id?: number | null;
    destination_country?: { id: number; uid?: string; countryName: string; countryCode: string } | null;
    visa_service_category_id?: number | null;
    category?: { id: number; name: string } | null;
    name: string | null;
    title: string;
    image?: string;
    description?: string;
    status: number;
    is_featured: boolean;
    created_at: string;
    cost_details?: VisaCostDetail[];
}

// One cost-detail row in the form. A visa can have several — Add More lets
// the admin append as many as needed (hasMany on the backend).
export interface VisaCostDetailInput {
    type: string;
    validation_process: string;
    processing_time: string;
    embassy_fee: string;
    service_fee: string;
    tax_fee: string;
    credit_amount: string;
    tax_amount: string;
}

export const emptyCostDetailRow = (): VisaCostDetailInput => ({
    type: '',
    validation_process: '',
    processing_time: '',
    embassy_fee: '',
    service_fee: '',
    tax_fee: '',
    credit_amount: '',
    tax_amount: '',
});

// Form data interface
export interface VisaFormData {
    visa_type_id: number | null;
    origin_country_id: number | null;
    destination_country_id: number | null;
    visa_service_category_id: number | null;
    name: string;
    title: string;
    description: string;
    image: File | null;
    status: number;
    is_featured: boolean;
    cost_details: VisaCostDetailInput[];
}

/**
 * Visa helpers and types. Admin create / edit / delete / status go through Inertia; the reads below are only for the public site.
 */

/**
 * COMPUTE ROW TOTAL COST - Tourism & Business: embassy fee + service fee + tax fee.
 * Work & Immigration: credit amount + tax amount.
 */
export const computeRowTotalCost = (row: VisaCostDetailInput): number => {
    const embassy = parseFloat(row.embassy_fee) || 0;
    const service = parseFloat(row.service_fee) || 0;
    const tax = parseFloat(row.tax_fee) || 0;
    const credit = parseFloat(row.credit_amount) || 0;
    const taxAmount = parseFloat(row.tax_amount) || 0;

    return embassy + service + tax + credit + taxAmount;
};

/**
 * Plain object for an Inertia post/put (sent as multipart so the image
 * uploads). Null ids are sent empty so the server clears them.
 */
export const toVisaPayload = (formData: VisaFormData) => ({
    visa_type_id: formData.visa_type_id,
    origin_country_id: formData.origin_country_id,
    destination_country_id: formData.destination_country_id,
    visa_service_category_id: formData.visa_service_category_id,
    name: formData.name.trim(),
    title: formData.title,
    description: formData.description,
    image: formData.image,
    status: formData.status,
    is_featured: formData.is_featured ? 1 : 0,
    cost_details: formData.cost_details.map((row) => ({ ...row })),
});

/**
 * Server validation errors for fields the wizard doesn't show inline
 * (cost rows, dropdowns) are surfaced as one form-level message.
 */
export const withFormError = (errors: Record<string, string>): Record<string, string> => {
    // Every server message also goes to the banner at the top, so an error on a
    // step you are not looking at (e.g. the image, from the Review step) is seen.
    const messages = [...new Set(Object.values(errors).filter(Boolean))];
    return messages.length > 0 ? { ...errors, form: messages.join(' ') } : errors;
};

/** What the wizard asks the server to check: the steps up to `through`, or just the image. */
export interface StepValidation {
    through: number;
    only?: 'image';
}

export interface StepValidationCallbacks {
    onValid: () => void;
    onInvalid: (errors: Record<string, string>) => void;
    onFinish?: () => void;
}

/**
 * The server does all the validating. This sends the form to the same rules a
 * save uses, so the wizard can show what is wrong before moving on.
 */
export const validateOnServer = (
    payload: ReturnType<typeof toVisaPayload>,
    options: StepValidation & { mode: 'create' | 'edit'; visaUid?: string },
    callbacks: StepValidationCallbacks,
): void => {
    router.post(
        '/admin/visa-services/validate',
        {
            ...payload,
            through: options.through,
            mode: options.mode,
            ...(options.only && { only: options.only }),
            ...(options.visaUid && { visa: options.visaUid }),
        },
        {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => callbacks.onValid(),
            onError: (errors) => callbacks.onInvalid(errors),
            onFinish: () => callbacks.onFinish?.(),
        },
    );
};

/** The server's reasons, as a toast. */
export const toastValidationErrors = (errors: Record<string, string>): void => {
    const messages = [...new Set(Object.values(errors).filter(Boolean))];
    toast.error(messages.join(' ') || 'Please check the form.', { duration: 6000 });
};

/** Shows why a save was rejected in a toast (the form is left as it was, so nothing typed is lost). */
export const toastSaveError = (errors: Record<string, string>): void => {
    const messages = [...new Set(Object.entries(errors).filter(([key, text]) => key !== 'form' && text).map(([, text]) => text))];
    toast.error(`Visa not saved. ${messages.length > 0 ? messages.join(' ') : 'Something went wrong, please try again.'}`, { duration: 7000 });
};

/**
 * FORMAT DATE - Convert date string to readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
};
