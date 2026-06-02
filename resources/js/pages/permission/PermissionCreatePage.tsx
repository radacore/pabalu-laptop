import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { PermissionForm } from '@/features/permission';
import { useTranslation } from 'react-i18next';

export default function PermissionCreatePage() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('permissions.create')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <PermissionForm mode="create" />
                </div>
            </div>
        </>
    );
}

const CreateLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('permissions.create')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

PermissionCreatePage.layout = (page: any) => <CreateLayout>{page}</CreateLayout>;
