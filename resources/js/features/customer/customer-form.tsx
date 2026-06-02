import { useTranslation } from 'react-i18next';
import { FieldInput } from '@/components/form/field-input';
import { FieldTextarea } from '@/components/form/field-textarea';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { LucideCircleX, LucideSave } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useConfirmDialogStore } from '@/stores/confirm-dialog-store';
import type { Customer } from './types';

interface CustomerFormProps {
    customer?: Customer;
    mode?: 'create' | 'edit';
}

export function CustomerForm({ customer, mode = 'create' }: CustomerFormProps) {
    const { t } = useTranslation();
    const isEditMode = mode === 'edit';
    const { show } = useConfirmDialogStore();

    const form = useForm({
        name: customer?.name || '',
        phone: customer?.phone || '',
        address: customer?.address || '',
        note: customer?.note || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            handleUpdate();
        } else {
            form.post(route('customers.store'));
        }
    };

    const handleUpdate = () => {
        show({
            title: t('common.confirm'),
            description: t('customers.update_confirm'),
            variant: 'info',
            confirmText: t('common.confirm'),
            onConfirm: () => {
                form.put(route('customers.update', customer!.id));
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditMode ? t('customers.edit') : t('customers.create')}</CardTitle>
                <CardDescription>
                    {isEditMode ? t('customers.edit_description') : t('customers.create_description')}
                </CardDescription>
            </CardHeader>
            <CardBody>
                <form onSubmit={submit} className="space-y-6">
                    <FieldInput
                        id="name"
                        name="name"
                        label={t('customers.name')}
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        required
                        autoFocus
                        placeholder={t('customers.name_placeholder')}
                        error={form.errors.name}
                    />

                    <FieldInput
                        id="phone"
                        name="phone"
                        label={t('customers.phone')}
                        value={form.data.phone}
                        onChange={(e) => form.setData('phone', e.target.value)}
                        required
                        placeholder={t('customers.phone_placeholder')}
                        error={form.errors.phone}
                    />

                    <FieldTextarea
                        id="address"
                        name="address"
                        label={t('customers.address')}
                        value={form.data.address}
                        onChange={(e) => form.setData('address', e.target.value)}
                        placeholder={t('customers.address_placeholder')}
                        error={form.errors.address}
                    />

                    <FieldTextarea
                        id="note"
                        name="note"
                        label={t('customers.note')}
                        value={form.data.note}
                        onChange={(e) => form.setData('note', e.target.value)}
                        placeholder={t('customers.note_placeholder')}
                        error={form.errors.note}
                    />

                    <div className="flex items-center gap-4 mt-8">
                        <Button variant="primary" type="submit" disabled={form.processing}>
                            <LucideSave />
                            {isEditMode ? t('common.save') : t('common.create')}
                        </Button>
                        <Link
                            as="button"
                            href={route('customers.index')}
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
