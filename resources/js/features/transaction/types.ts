export interface Transaction {
    id: number;
    transaction_code: string;
    type: 'income' | 'expense' | 'transfer';
    category: string | null;
    amount: string;
    description: string | null;
    reference_type: string | null;
    reference_id: number | null;
    transaction_date: string;
    payment_method: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface TransactionIndexPageProps {
    transactions: {
        data: Transaction[];
        links: any[];
        first_page_url: string;
        last_page_url: string;
        current_page: number;
        last_page: number;
    };
}
