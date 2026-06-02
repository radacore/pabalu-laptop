import { useTranslation } from 'react-i18next';
import { FieldInput } from '@/components/form/field-input';
import { FieldSelect } from '@/components/form/field-select';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { LucideCircleX, LucideSave } from 'lucide-react';
import { useConfirmDialogStore } from '@/stores/confirm-dialog-store';
import type { Transaction } from './types';

interface TransactionFormProps {
    transaction?: Transaction;
    mode?: 'create' | 'edit';
}

export function TransactionForm({ transaction, mode = 'create' }: TransactionFormProps) {
    const { t } = useTranslation();
    const isEditMode = mode === 'edit';
    const { show } = useConfirmDialogStore();

    const form = useForm({
        type: transaction?.type || 'income',
        category: transaction?.category || '',
        amount: transaction?.amount || '',
        description: transaction?.description || '',
        transaction_date: transaction?.transaction_date || new Date().toISOString().split('T')[0],
        payment_method: transaction?.payment_method || '',
        notes: transaction?.notes || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            handleUpdate();
        } else {
            form.post(route('transactions.store'));
        }
    };

    const handleUpdate = () => {
        show({
            title: t('common.confirm'),
            description: t('transactions.update_confirm'),
            variant: 'info',
            confirmText: t('common.confirm'),
            onConfirm: () => {
                form.put(route('transactions.update', transaction!.id));
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditMode ? t('transactions.edit') : t('transactions.create')}</CardTitle>
                <CardDescription>
                    {isEditMode ? t('transactions.edit_description') : t('transactions.create_description')}
                </CardDescription>
            </CardHeader>
            <CardBody>
                <form onSubmit={submit} className="space-y-6">
                    <FieldSelect
                        label={t('transactions.type')}
                        value={form.data.type}
                        onValueChange={(value: unknown) => form.setData('type', value as 'income' | 'expense' | 'transfer')}
                        required
                        error={form.errors.type}
                        options={[
                            { value: 'income', label: t('transactions.types.income') },
                            { value: 'expense', label: t('transactions.types.expense') },
                            { value: 'transfer', label: t('transactions.types.transfer') },
                        ]}
                    />

                    <FieldInput
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        label={t('transactions.amount')}
                        value={form.data.amount}
                        onChange={(e) => form.setData('amount', e.target.value)}
                        required
                        autoFocus
                        placeholder="0.00"
                        error={form.errors.amount}
                    />

                    <FieldInput
                        id="category"
                        name="category"
                        label={t('transactions.category')}
                        value={form.data.category}
                        onChange={(e) => form.setData('category', e.target.value)}
                        placeholder={t('transactions.category')}
                        error={form.errors.category}
                    />

                    <FieldInput
                        id="transaction_date"
                        name="transaction_date"
                        type="date"
                        label={t('transactions.transaction_date')}
                        value={form.data.transaction_date}
                        onChange={(e) => form.setData('transaction_date', e.target.value)}
                        required
                        error={form.errors.transaction_date}
                    />

                    <FieldInput
                        id="payment_method"
                        name="payment_method"
                        label={t('transactions.payment_method')}
                        value={form.data.payment_method}
                        onChange={(e) => form.setData('payment_method', e.target.value)}
                        placeholder={t('transactions.payment_method')}
                        error={form.errors.payment_method}
                    />

                    <FieldInput
                        id="description"
                        name="description"
                        label={t('transactions.description')}
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        placeholder={t('transactions.description')}
                        error={form.errors.description}
                    />

                    <FieldInput
                        id="notes"
                        name="notes"
                        label={t('transactions.notes')}
                        value={form.data.notes}
                        onChange={(e) => form.setData('notes', e.target.value)}
                        placeholder={t('transactions.notes')}
                        error={form.errors.notes}
                    />

                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href={route('transactions.index')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <LucideCircleX className="size-4" />
                            {t('common.cancel')}
                        </Link>
                        <Button type="submit" disabled={form.processing}>
                            <LucideSave className="size-4 mr-2" />
                            {isEditMode ? t('common.confirm') : t('common.save')}
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}
