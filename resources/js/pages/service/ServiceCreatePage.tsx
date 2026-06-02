import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { ServiceForm, ServiceOption, ServiceStatusOption } from '@/features/service';
import { useTranslation } from 'react-i18next';

interface ServiceCreatePageProps {
    customers: ServiceOption[];
    laptops: ServiceOption[];
    serviceCategories: ServiceOption[];
    statuses: ServiceStatusOption[];
}

export default function ServiceCreatePage({ customers, laptops, serviceCategories, statuses }: ServiceCreatePageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('services.create', { defaultValue: 'Create Service' })} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <ServiceForm customers={customers} laptops={laptops} serviceCategories={serviceCategories} statuses={statuses} mode="create" />
                </div>
            </div>
        </>
    );
}

const CreateLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('services.create', { defaultValue: 'Create Service' })}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

ServiceCreatePage.layout = (page: any) => <CreateLayout>{page}</CreateLayout>;
