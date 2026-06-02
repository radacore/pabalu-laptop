export type ServiceStatus = 'received' | 'diagnosed' | 'in_progress' | 'waiting_parts' | 'waiting_approval' | 'repaired' | 'pickup_ready' | 'completed' | 'cancelled';

export interface ServiceUpdate {
    id: number;
    service_id: number;
    user_id: number | null;
    content: string;
    old_status: ServiceStatus | null;
    new_status: ServiceStatus;
    is_customer_visible: boolean;
    created_at: string;
}

export interface ServicePart {
    id: number;
    service_id: number;
    part_name: string;
    quantity: number;
    unit_price: string;
}

export interface ServicePhoto {
    id: number;
    service_id: number;
    photo_path: string;
    caption: string | null;
}

export interface Service {
    id: number;
    tracking_code: string;
    customer_id: number;
    laptop_id: number | null;
    service_category_id: number;
    laptop_model: string | null;
    laptop_serial: string | null;
    issue_description: string;
    diagnosis: string | null;
    status: ServiceStatus;
    estimated_cost: string | null;
    final_cost: string | null;
    down_payment: string | null;
    pickup_date: string | null;
    completion_date: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    customer?: { id: number; name: string; phone: string };
    laptop?: { id: number; model_name: string };
    serviceCategory?: { id: number; name: string };
    service_category?: { id: number; name: string };
    updates?: ServiceUpdate[];
    parts?: ServicePart[];
    photos?: ServicePhoto[];
}

export interface ServiceOption {
    id: number;
    name: string;
}

export interface ServiceStatusOption {
    value: ServiceStatus;
    label: string;
}

export interface ServiceIndexPageProps {
    services: {
        data: Service[];
        links: any[];
        first_page_url: string;
        last_page_url: string;
        current_page: number;
        last_page: number;
    };
    statuses: ServiceStatusOption[];
}
