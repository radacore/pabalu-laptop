export interface Brand {
    id: number;
    name: string;
    description: string | null;
    logo: string | null;
    created_at: string;
    updated_at: string;
}

export interface BrandIndexPageProps {
    brands: {
        data: Brand[];
        links: any[];
        first_page_url: string;
        last_page_url: string;
        current_page: number;
        last_page: number;
    };
}
