import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { UserForm } from '@/features/user';
import { useTranslation } from 'react-i18next';
import type { Role } from '@/types';

interface UserCreatePageProps {
    roles: Role[];
}

export default function UserCreatePage({ roles }: UserCreatePageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('users.create')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <UserForm roles={roles} mode="create" />
                </div>
            </div>
        </>
    );
}

const CreateLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('users.create')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

UserCreatePage.layout = (page: any) => <CreateLayout>{page}</CreateLayout>;
