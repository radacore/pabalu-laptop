import { useTranslation } from 'react-i18next';
import { FieldInput } from '@/components/form/field-input';
import { FieldTextarea } from '@/components/form/field-textarea';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { LucideCircleX, LucideSave } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useConfirmDialogStore } from '@/stores/confirm-dialog-store';
import type { Permission } from '@/types';

interface PermissionFormProps {
    permission?: Permission;
    mode?: 'create' | 'edit';
}

export function PermissionForm({ permission, mode = 'create' }: PermissionFormProps) {
    const { t } = useTranslation();
    const isEditMode = mode === 'edit';
    const { show } = useConfirmDialogStore();

    const form = useForm({
        name: permission?.name || '',
        description: permission?.description || '',
        guard_name: permission?.guard_name || 'web',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            handleUpdate();
        } else {
            form.post(route('permissions.store'));
        }
    };

    const handleUpdate = () => {
        show({
            title: t('common.confirm'),
            description: t('permissions.update_confirm'),
            variant: 'info',
            confirmText: t('common.confirm'),
            onConfirm: () => {
                form.put(route('permissions.update', permission!.id));
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditMode ? t('permissions.edit') : t('permissions.create')}</CardTitle>
                <CardDescription>
                    {isEditMode ? t('permissions.edit_description') : t('permissions.create_description')}
                </CardDescription>
            </CardHeader>
            <CardBody>
                <form onSubmit={submit} className="space-y-6">
                    <FieldInput
                        id="name"
                        name="name"
                        label={t('permissions.name')}
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        required
                        autoFocus
                        placeholder={t('permissions.name_placeholder', { defaultValue: 'e.g., edit-posts, delete-users' })}
                        error={form.errors.name}
                    />

                    <FieldTextarea
                        id="description"
                        name="description"
                        label={t('permissions.description')}
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        placeholder={t('permissions.description_placeholder', { defaultValue: 'Enter permission description' })}
                        error={form.errors.description}
                    />

                    <FieldInput
                        id="guard_name"
                        name="guard_name"
                        label={t('roles.guard_name')}
                        value={form.data.guard_name}
                        onChange={(e) => form.setData('guard_name', e.target.value)}
                        required
                        placeholder={t('roles.guard_name_placeholder')}
                        error={form.errors.guard_name}
                    />

                    <div className="flex items-center gap-4 mt-8">
                        <Button variant="primary" type="submit" disabled={form.processing}>
                            <LucideSave />
                            {isEditMode ? t('common.save') : t('common.create')}
                        </Button>
                        <Link
                            as="button"
                            href={route('permissions.index')}
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
