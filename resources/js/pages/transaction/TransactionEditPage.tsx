import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { TransactionForm, Transaction } from '@/features/transaction';
import { useTranslation } from 'react-i18next';

interface TransactionEditPageProps {
    transaction: Transaction;
}

export default function TransactionEditPage({ transaction }: TransactionEditPageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('transactions.edit')}: ${transaction.transaction_code}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <TransactionForm transaction={transaction} mode="edit" />
                </div>
            </div>
        </>
    );
}

const EditLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('transactions.edit')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

TransactionEditPage.layout = (page: any) => <EditLayout>{page}</EditLayout>;
