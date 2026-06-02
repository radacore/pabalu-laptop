import { useTranslation } from 'react-i18next';
import { FieldInput } from '@/components/form/field-input';
import { FieldTextarea } from '@/components/form/field-textarea';
import { FieldCheckbox } from '@/components/form/field-checkbox';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { LucideCircleX, LucideSave } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useConfirmDialogStore } from '@/stores/confirm-dialog-store';
import type { Permission, RoleWithRelations } from '@/types';

interface RoleFormProps {
    permissions: Permission[];
    role?: RoleWithRelations;
    mode?: 'create' | 'edit';
}

export function RoleForm({ permissions, role, mode = 'create' }: RoleFormProps) {
    const { t } = useTranslation();
    const isEditMode = mode === 'edit';
    const { show } = useConfirmDialogStore();

    const form = useForm({
        name: role?.name || '',
        description: role?.description || '',
        guard_name: role?.guard_name || 'web',
        permissions: role?.permissions.map((p) => p.id) || ([] as number[]),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            handleUpdate();
        } else {
            form.post(route('roles.store'));
        }
    };

    const handleUpdate = () => {
        show({
            title: t('common.confirm'),
            description: t('roles.update_confirm'),
            variant: 'info',
            confirmText: t('common.confirm'),
            onConfirm: () => {
                form.put(route('roles.update', role!.id));
            },
        });
    };

    const togglePermission = (permissionId: number) => {
        if (form.data.permissions.includes(permissionId)) {
            form.setData('permissions', form.data.permissions.filter((id) => id !== permissionId));
        } else {
            form.setData('permissions', [...form.data.permissions, permissionId]);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditMode ? t('roles.edit') : t('roles.create')}</CardTitle>
                <CardDescription>
                    {isEditMode ? t('roles.edit_description') : t('roles.create_description')}
                </CardDescription>
            </CardHeader>
            <CardBody>
                <form onSubmit={submit} className="space-y-6">
                    <FieldInput
                        id="name"
                        name="name"
                        label={t('roles.name')}
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        required
                        autoFocus
                        placeholder={t('roles.name_placeholder')}
                        error={form.errors.name}
                    />

                    <FieldTextarea
                        id="description"
                        name="description"
                        label={t('roles.description')}
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        placeholder={t('roles.description_placeholder')}
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

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                            {t('permissions.title')}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                            {permissions.map((permission) => (
                                <FieldCheckbox
                                    key={permission.id}
                                    id={`permission-${permission.id}`}
                                    name="permissions"
                                    label={permission.name}
                                    description={permission.description || undefined}
                                    checked={form.data.permissions.includes(permission.id)}
                                    onCheckedChange={() => togglePermission(permission.id)}
                                />
                            ))}
                        </div>
                        {form.errors.permissions && (
                            <p className="text-[0.8rem] font-medium text-danger">{form.errors.permissions}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-8">
                        <Button variant="primary" type="submit" disabled={form.processing}>
                            <LucideSave />
                            {isEditMode ? t('common.save') : t('common.create')}
                        </Button>
                        <Link
                            as="button"
                            href={route('roles.index')}
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
