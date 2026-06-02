export interface Customer {
    id: number;
    user_id: number;
    name: string;
    phone: string;
    address: string | null;
    note: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        is_active: boolean;
    };
}

export interface CustomerIndexPageProps {
    customers: {
        data: Customer[];
        links: any[];
        first_page_url: string;
        last_page_url: string;
        current_page: number;
        last_page: number;
    };
}
