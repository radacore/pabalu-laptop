import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { LaptopSourceForm } from '@/features/laptop-source';
import { useTranslation } from 'react-i18next';

export default function LaptopSourceCreatePage() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('laptop_sources.create')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <LaptopSourceForm mode="create" />
                </div>
            </div>
        </>
    );
}

const CreateLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('laptop_sources.create')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

LaptopSourceCreatePage.layout = (page: any) => <CreateLayout>{page}</CreateLayout>;
