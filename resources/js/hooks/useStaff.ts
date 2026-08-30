import { usePage, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

export interface Staff {
    id: number;
    uid: string;
    name: string;
    email: string;
    phone?: string;
    profile_pic?: string;
    profile_image_url?: string;
    type: string;
    status?: boolean;
    created_at: string;
    updated_at: string;
}

interface StaffPageProps {
    staff: {
        data: Staff[];
        current_page: number;
        last_page: number;
        per_page: number;
    };
    filters: {
        search?: string;
    };
    presentToday?: number;
    totalStaff?: number;
}

export function useStaff() {
    const page = usePage();
    const props = page.props as unknown as StaffPageProps;
    const { staff, filters, presentToday, totalStaff } = props;
    const [loading, setLoading] = useState(false);

    const handleFilterChange = useCallback((newFilters: Partial<StaffPageProps['filters']>) => {
        setLoading(true);
        router.visit('/admin/staff', {
            data: { ...filters, ...newFilters, page: 1 },
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    }, [filters]);

    const handlePageChange = useCallback((page: number) => {
        setLoading(true);
        router.visit('/admin/staff', {
            data: { ...filters, page },
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    }, [filters]);

    const handleReset = useCallback(() => {
        setLoading(true);
        router.visit('/admin/staff', {
            data: { page: 1 },
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    }, []);

    return {
        staff: staff?.data || [],
        currentPage: staff?.current_page || 1,
        lastPage: staff?.last_page || 1,
        perPage: staff?.per_page || 15,
        filters,
        loading,
        presentToday: presentToday ?? 0,
        totalStaff: totalStaff ?? 0,
        handleFilterChange,
        handlePageChange,
        handleReset,
    };
}
