import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { BrandForm } from '@/features/brand';
import { useTranslation } from 'react-i18next';
import type { Brand } from '@/features/brand';

interface BrandEditPageProps {
    brand: Brand;
}

export default function BrandEditPage({ brand }: BrandEditPageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('brands.edit')}: ${brand.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <BrandForm brand={brand} mode="edit" />
                </div>
            </div>
        </>
    );
}

const EditLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('brands.edit')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

BrandEditPage.layout = (page: any) => <EditLayout>{page}</EditLayout>;
