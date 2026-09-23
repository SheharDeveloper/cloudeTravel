import { Head, usePage } from '@inertiajs/react';
import VisaRequirementsSearch, { type VisaRequirementsProps } from '@/components/VisaRequirementsSearch';

export default function VisaRequirements() {
    const props = usePage().props as unknown as Omit<VisaRequirementsProps, 'basePath' | 'resultPath'>;

    return (
        <>
            <Head title="Travel Visa Requirements - CloudTravel">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            </Head>
            <VisaRequirementsSearch {...props} basePath="/visa-requirements" />
        </>
    );
}
