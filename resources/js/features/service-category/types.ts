export interface ServiceCategory {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface ServiceCategoryIndexPageProps {
    serviceCategories: {
        data: ServiceCategory[];
        links: any[];
        first_page_url: string;
        last_page_url: string;
        current_page: number;
        last_page: number;
    };
}
