import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { ServiceCategoryForm } from '@/features/service-category';
import { useTranslation } from 'react-i18next';

export default function ServiceCategoryCreatePage() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('service_categories.create')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <ServiceCategoryForm mode="create" />
                </div>
            </div>
        </>
    );
}

const CreateLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('service_categories.create')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

ServiceCategoryCreatePage.layout = (page: any) => <CreateLayout>{page}</CreateLayout>;
