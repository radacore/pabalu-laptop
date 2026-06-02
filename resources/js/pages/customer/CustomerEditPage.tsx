import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { CustomerForm } from '@/features/customer';
import { useTranslation } from 'react-i18next';
import type { Customer } from '@/features/customer';

interface CustomerEditPageProps {
    customer: Customer;
}

export default function CustomerEditPage({ customer }: CustomerEditPageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('customers.edit')}: ${customer.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <CustomerForm customer={customer} mode="edit" />
                </div>
            </div>
        </>
    );
}

const EditLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('customers.edit')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

CustomerEditPage.layout = (page: any) => <EditLayout>{page}</EditLayout>;
