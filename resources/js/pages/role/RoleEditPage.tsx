import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { RoleForm } from '@/features/role';
import { useTranslation } from 'react-i18next';
import type { RoleWithRelations, Permission } from '@/types';

interface RoleEditPageProps {
    role: RoleWithRelations;
    permissions: Permission[];
}

export default function RoleEditPage({ role, permissions }: RoleEditPageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('roles.edit')}: ${role.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <RoleForm role={role} permissions={permissions} mode="edit" />
                </div>
            </div>
        </>
    );
}

const EditLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('roles.edit')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

RoleEditPage.layout = (page: any) => <EditLayout>{page}</EditLayout>;
