import { useTranslation } from 'react-i18next';
import { FieldInput } from '@/components/form/field-input';
import { FieldSelect } from '@/components/form/field-select';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { LucideCircleX, LucideSave } from 'lucide-react';
import { cn } from '@/utils/cn';  
import { useConfirmDialogStore } from '@/stores/confirm-dialog-store';
import type { Role, UserWithRelations } from '@/types';

interface UserFormProps {
    roles: Role[];
    user?: UserWithRelations;
    mode?: 'create' | 'edit';
}

export function UserForm({ roles, user, mode = 'create' }: UserFormProps) {
    const { t } = useTranslation();
    const isEditMode = mode === 'edit';
    const { show } = useConfirmDialogStore();

    const form = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role: user?.roles?.[0]?.name || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            handleUpdate();
        } else {
            form.post(route('users.store'));
        }
    };

    const handleUpdate = () => {
        show({
            title: t('common.confirm'),
            description: t('users.update_confirm'),
            variant: 'info',
            confirmText: t('common.confirm'),
            onConfirm: () => {
                form.put(route('users.update', user!.id));
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditMode ? t('users.edit') : t('users.create')}</CardTitle>
                <CardDescription>
                    {isEditMode ? t('users.edit_description') : t('users.create_description')}
                </CardDescription>
            </CardHeader>
            <CardBody>
                <form onSubmit={submit} className="space-y-6">
                    <FieldInput
                        id="name"
                        name="name"
                        label={t('users.name')}
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        required
                        autoFocus
                        placeholder={t('users.name_placeholder')}
                        error={form.errors.name}
                    />

                    <FieldInput
                        id="email"
                        name="email"
                        type="email"
                        label={t('users.email')}
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        required
                        placeholder={t('users.email_placeholder')}
                        error={form.errors.email}
                    />

                    <FieldInput
                        id="password"
                        name="password"
                        type="password"
                        label={t('auth.password')}
                        value={form.data.password}
                        onChange={(e) => form.setData('password', e.target.value)}
                        required={!isEditMode}
                        placeholder={isEditMode ? t('users.password_placeholder_edit') : t('users.password_placeholder')}
                        error={form.errors.password}
                    />

                    <FieldInput
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        label={t('auth.confirm_password')}
                        value={form.data.password_confirmation}
                        onChange={(e) => form.setData('password_confirmation', e.target.value)}
                        required={!isEditMode}
                        placeholder={isEditMode ? t('users.password_confirm_placeholder_edit') : t('users.password_confirm_placeholder')}
                        error={form.errors.password_confirmation}
                    />

                    <FieldSelect
                        name="role"
                        label={t('users.role')}
                        value={form.data.role}
                        onValueChange={(value) => form.setData('role', value as string)}
                        placeholder={t('users.select_role')}
                        options={roles.map((role) => ({ label: role.name, value: role.name }))}
                        required={!isEditMode}
                        error={form.errors.role}
                    />

                    <div className="flex items-center gap-4 mt-8">
                        <Button variant="primary" type="submit" disabled={form.processing}>
                            <LucideSave />
                            {isEditMode ? t('common.save') : t('common.create')}
                        </Button>
                        <Link
                            as="button"
                            href={route('users.index')}
                            className={cn(buttonVariants({ variant: 'outline' }))}
                        >
                            <LucideCircleX />
                            {t('common.cancel')}
                        </Link>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}
