import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { Laptop, LaptopForm, LaptopOption } from '@/features/laptop';
import { useTranslation } from 'react-i18next';

interface LaptopEditPageProps {
    laptop: Laptop;
    brands: LaptopOption[];
    laptopSources: LaptopOption[];
}

export default function LaptopEditPage({ laptop, brands, laptopSources }: LaptopEditPageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('laptops.edit', { defaultValue: 'Edit Laptop' })}: ${laptop.model_name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <LaptopForm laptop={laptop} brands={brands} laptopSources={laptopSources} mode="edit" />
                </div>
            </div>
        </>
    );
}

const EditLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('laptops.edit', { defaultValue: 'Edit Laptop' })}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

LaptopEditPage.layout = (page: any) => <EditLayout>{page}</EditLayout>;
