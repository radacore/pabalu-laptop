import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { RoleForm } from '@/features/role';
import { useTranslation } from 'react-i18next';
import type { Permission } from '@/types';

interface RoleCreatePageProps {
    permissions: Permission[];
}

export default function RoleCreatePage({ permissions }: RoleCreatePageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('roles.create')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <RoleForm permissions={permissions} mode="create" />
                </div>
            </div>
        </>
    );
}

const CreateLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('roles.create')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

RoleCreatePage.layout = (page: any) => <CreateLayout>{page}</CreateLayout>;
