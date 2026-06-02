import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { LaptopSourceForm } from '@/features/laptop-source';
import { useTranslation } from 'react-i18next';
import type { LaptopSource } from '@/features/laptop-source';

interface LaptopSourceEditPageProps {
    laptopSource: LaptopSource;
}

export default function LaptopSourceEditPage({ laptopSource }: LaptopSourceEditPageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('laptop_sources.edit')}: ${laptopSource.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <LaptopSourceForm laptopSource={laptopSource} mode="edit" />
                </div>
            </div>
        </>
    );
}

const EditLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('laptop_sources.edit')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

LaptopSourceEditPage.layout = (page: any) => <EditLayout>{page}</EditLayout>;
