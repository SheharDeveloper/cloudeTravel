import { usePage, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

export interface Booking {
    id: number;
    uid: string;
    type: string;
    service?: string;
    first_name: string;
    name?: string;
    email: string;
    country_code: string;
    phone: string;
    country?: string;
    total_members?: number;
    travel_date?: string;
    from_city?: string;
    to_city?: string;
    destination?: string;
    status: string;
    flight_data?: any;
    hotel_data?: any;
    visa_data?: any;
    package_data?: any;
    airport_transport_data?: any;
    created_at: string;
}

interface BookingsPageProps {
    bookings: Booking[];
    current_page: number;
    last_page: number;
    filters: {
        search?: string;
        service?: string;
        status?: string;
    };
}

export function useBookings() {
    const page = usePage();
    const props = page.props as unknown as BookingsPageProps;
    const { bookings, current_page, last_page, filters } = props;
    const [loading, setLoading] = useState(false);

    const handleFilterChange = useCallback((newFilters: Partial<BookingsPageProps['filters']>) => {
        setLoading(true);
        router.visit('/admin/bookings', {
            data: { ...filters, ...newFilters, page: 1 },
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    }, [filters]);

    const handlePageChange = useCallback((page: number) => {
        setLoading(true);
        router.visit('/admin/bookings', {
            data: { ...filters, page },
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    }, [filters]);

    const handleReset = useCallback(() => {
        setLoading(true);
        router.visit('/admin/bookings', {
            data: { page: 1 },
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    }, []);

    return {
        bookings,
        currentPage: current_page,
        lastPage: last_page,
        filters,
        loading,
        handleFilterChange,
        handlePageChange,
        handleReset,
    };
}
