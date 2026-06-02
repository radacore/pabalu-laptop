import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { PermissionForm } from '@/features/permission';
import { useTranslation } from 'react-i18next';
import type { Permission } from '@/types';

interface PermissionEditPageProps {
    permission: Permission;
}

export default function PermissionEditPage({ permission }: PermissionEditPageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('permissions.edit')}: ${permission.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <PermissionForm permission={permission} mode="edit" />
                </div>
            </div>
        </>
    );
}

const EditLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('permissions.edit')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

PermissionEditPage.layout = (page: any) => <EditLayout>{page}</EditLayout>;
