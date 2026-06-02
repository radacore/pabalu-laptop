import { useTranslation } from 'react-i18next';
import { FieldInput } from '@/components/form/field-input';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { LucideCircleX, LucideSave } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useConfirmDialogStore } from '@/stores/confirm-dialog-store';
import type { Brand } from './types';

interface BrandFormProps {
    brand?: Brand;
    mode?: 'create' | 'edit';
}

export function BrandForm({ brand, mode = 'create' }: BrandFormProps) {
    const { t } = useTranslation();
    const isEditMode = mode === 'edit';
    const { show } = useConfirmDialogStore();

    const form = useForm({
        name: brand?.name || '',
        description: brand?.description || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            handleUpdate();
        } else {
            form.post(route('brands.store'));
        }
    };

    const handleUpdate = () => {
        show({
            title: t('common.confirm'),
            description: t('brands.update_confirm'),
            variant: 'info',
            confirmText: t('common.confirm'),
            onConfirm: () => {
                form.put(route('brands.update', brand!.id));
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditMode ? t('brands.edit') : t('brands.create')}</CardTitle>
                <CardDescription>
                    {isEditMode ? t('brands.edit_description') : t('brands.create_description')}
                </CardDescription>
            </CardHeader>
            <CardBody>
                <form onSubmit={submit} className="space-y-6">
                    <FieldInput
                        id="name"
                        name="name"
                        label={t('brands.name')}
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        required
                        autoFocus
                        placeholder={t('brands.name_placeholder')}
                        error={form.errors.name}
                    />

                    <FieldInput
                        id="description"
                        name="description"
                        label={t('brands.description')}
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        placeholder={t('brands.description_placeholder')}
                        error={form.errors.description}
                    />

                    <div className="flex items-center gap-4 mt-8">
                        <Button variant="primary" type="submit" disabled={form.processing}>
                            <LucideSave />
                            {isEditMode ? t('common.save') : t('common.create')}
                        </Button>
                        <Link
                            as="button"
                            href={route('brands.index')}
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
