import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { CustomerForm } from '@/features/customer';
import { useTranslation } from 'react-i18next';

export default function CustomerCreatePage() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('customers.create')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <CustomerForm mode="create" />
                </div>
            </div>
        </>
    );
}

const CreateLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('customers.create')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

CustomerCreatePage.layout = (page: any) => <CreateLayout>{page}</CreateLayout>;
