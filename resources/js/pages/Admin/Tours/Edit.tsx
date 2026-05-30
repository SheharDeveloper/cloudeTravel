import { Head } from '@inertiajs/react';
import TourForm from './Form';

interface Props {
    tour: any;
}

/**
 * Edit Tour Page
 */
export default function EditTour({ tour }: Props) {
    return (
        <>
            <Head title={`Edit ${tour.name} - Admin`} />
            <TourForm tour={tour} isEdit={true} />
        </>
    );
}
