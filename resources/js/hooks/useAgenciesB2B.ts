import { usePage, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

export interface AgencyB2B {
    id: number;
    uid: string;
    user_id?: number;
    agency_name: string;
    legal_name?: string;
    email: string;
    phone_number: string;
    alternate_phone?: string;
    website?: string;
    country: string;
    state?: string;
    city?: string;
    postal_code?: string;
    address?: string;
    registration_number?: string;
    gst_number?: string;
    pan_number?: string;
    account_number?: string;
    ifsc_code?: string;
    note?: string;
    services?: string[];
    logo?: string;
    has_domain?: boolean;
    tenant_id?: string;
    documents?: any;
    agency_documents?: any[];
    agency_services?: Array<{ id: number; service_name: string; status: boolean }>;
    tax_status?: number;
    status?: boolean;
    created_at: string;
    updated_at: string;
    user?: any;
}

interface AgenciesB2BPageProps {
    agencies: {
        data: AgencyB2B[];
        current_page: number;
        last_page: number;
        per_page: number;
    };
    filters: {
        search?: string;
    };
}

export function useAgenciesB2B() {
    const page = usePage();
    const props = page.props as unknown as AgenciesB2BPageProps;
    const { agencies, filters } = props;
    const [loading, setLoading] = useState(false);

    const handleFilterChange = useCallback((newFilters: Partial<AgenciesB2BPageProps['filters']>) => {
        setLoading(true);
        router.visit('/admin/agency-b2b', {
            data: { ...filters, ...newFilters, page: 1 },
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    }, [filters]);

    const handlePageChange = useCallback((page: number) => {
        setLoading(true);
        router.visit('/admin/agency-b2b', {
            data: { ...filters, page },
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    }, [filters]);

    const handleReset = useCallback(() => {
        setLoading(true);
        router.visit('/admin/agency-b2b', {
            data: { page: 1 },
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    }, []);

    return {
        agencies: agencies?.data || [],
        currentPage: agencies?.current_page || 1,
        lastPage: agencies?.last_page || 1,
        perPage: agencies?.per_page || 15,
        filters,
        loading,
        handleFilterChange,
        handlePageChange,
        handleReset,
    };
}
