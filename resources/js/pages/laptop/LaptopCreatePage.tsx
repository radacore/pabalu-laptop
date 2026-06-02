import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { LaptopForm, LaptopOption } from '@/features/laptop';
import { useTranslation } from 'react-i18next';

interface LaptopCreatePageProps {
    brands: LaptopOption[];
    laptopSources: LaptopOption[];
}

export default function LaptopCreatePage({ brands, laptopSources }: LaptopCreatePageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('laptops.create', { defaultValue: 'Create Laptop' })} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <LaptopForm brands={brands} laptopSources={laptopSources} mode="create" />
                </div>
            </div>
        </>
    );
}

const CreateLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('laptops.create', { defaultValue: 'Create Laptop' })}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

LaptopCreatePage.layout = (page: any) => <CreateLayout>{page}</CreateLayout>;
