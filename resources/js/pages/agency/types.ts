export interface Agency {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: 'Active' | 'Pending' | 'Suspended';
    joined: string;
}

export type AgencyFormData = Omit<Agency, 'id' | 'joined'>;
