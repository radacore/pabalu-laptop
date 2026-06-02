export interface LaptopSource {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface LaptopSourceIndexPageProps {
    laptopSources: {
        data: LaptopSource[];
        links: any[];
        first_page_url: string;
        last_page_url: string;
        current_page: number;
        last_page: number;
    };
}
