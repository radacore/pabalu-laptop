import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Heading } from '@/components/ui/heading';
import { UserForm } from '@/features/user';
import { useTranslation } from 'react-i18next';
import type { Role, UserWithRelations } from '@/types';

interface UserEditPageProps {
    user: UserWithRelations;
    roles: Role[];
}

export default function UserEditPage({ user, roles }: UserEditPageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('users.edit')}: ${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <UserForm roles={roles} user={user} mode="edit" />
                </div>
            </div>
        </>
    );
}

const EditLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('users.edit')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

UserEditPage.layout = (page: any) => <EditLayout>{page}</EditLayout>;
