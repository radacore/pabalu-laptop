import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { BrandForm } from '@/features/brand';
import { useTranslation } from 'react-i18next';

export default function BrandCreatePage() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('brands.create')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <BrandForm mode="create" />
                </div>
            </div>
        </>
    );
}

const CreateLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('brands.create')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

BrandCreatePage.layout = (page: any) => <CreateLayout>{page}</CreateLayout>;
