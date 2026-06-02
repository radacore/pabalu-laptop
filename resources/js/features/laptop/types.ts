export interface LaptopSpec {
    id: number;
    laptop_id: number;
    processor: string | null;
    ram: string | null;
    storage: string | null;
    gpu: string | null;
    display: string | null;
    battery: string | null;
    os: string | null;
    color: string | null;
    year: string | null;
}

export interface LaptopPhoto {
    id: number;
    laptop_id: number;
    photo_path: string;
    is_primary: boolean;
}

export interface Laptop {
    id: number;
    brand_id: number;
    laptop_source_id: number;
    model_name: string;
    serial_number: string | null;
    condition: string;
    status: string;
    purchase_price: string | null;
    selling_price: string | null;
    purchase_date: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    brand?: { id: number; name: string };
    laptop_source?: { id: number; name: string };
    specs?: LaptopSpec | null;
    photos?: LaptopPhoto[];
}

export interface LaptopOption {
    id: number;
    name: string;
}

export interface LaptopIndexPageProps {
    laptops: {
        data: Laptop[];
        links: any[];
        first_page_url: string;
        last_page_url: string;
        current_page: number;
        last_page: number;
    };
    brands: LaptopOption[];
    laptopSources?: LaptopOption[];
}
