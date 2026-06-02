import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { ServiceCategoryForm } from '@/features/service-category';
import { useTranslation } from 'react-i18next';
import type { ServiceCategory } from '@/features/service-category';

interface ServiceCategoryEditPageProps {
    serviceCategory: ServiceCategory;
}

export default function ServiceCategoryEditPage({ serviceCategory }: ServiceCategoryEditPageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('service_categories.edit')}: ${serviceCategory.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <ServiceCategoryForm serviceCategory={serviceCategory} mode="edit" />
                </div>
            </div>
        </>
    );
}

const EditLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('service_categories.edit')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

ServiceCategoryEditPage.layout = (page: any) => <EditLayout>{page}</EditLayout>;
