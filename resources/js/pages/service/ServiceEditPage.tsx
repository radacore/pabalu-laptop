import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { Service, ServiceForm, ServiceOption, ServiceStatusOption } from '@/features/service';
import { useTranslation } from 'react-i18next';

interface ServiceEditPageProps {
    service: Service;
    customers: ServiceOption[];
    laptops: ServiceOption[];
    serviceCategories: ServiceOption[];
    statuses: ServiceStatusOption[];
}

export default function ServiceEditPage({ service, customers, laptops, serviceCategories, statuses }: ServiceEditPageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('services.edit', { defaultValue: 'Edit Service' })}: ${service.tracking_code}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <ServiceForm service={service} customers={customers} laptops={laptops} serviceCategories={serviceCategories} statuses={statuses} mode="edit" />
                </div>
            </div>
        </>
    );
}

const EditLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('services.edit', { defaultValue: 'Edit Service' })}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

ServiceEditPage.layout = (page: any) => <EditLayout>{page}</EditLayout>;
