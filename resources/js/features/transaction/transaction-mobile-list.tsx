import { Link } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { LucideSquarePen } from 'lucide-react';
import { Transaction } from './types';
import { TransactionDeleteDialog } from './transaction-delete-dialog';
import { useTranslation } from 'react-i18next';

function TypeBadge({ type }: { type: string }) {
    const { t } = useTranslation();
    const colors: Record<string, string> = {
        income: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        expense: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        transfer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colors[type])}>
            {t(`transactions.types.${type}`)}
        </span>
    );
}

function formatCurrency(value: string | null) {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value));
}

interface TransactionMobileListProps {
    transactions: Transaction[];
}

export function TransactionMobileList({ transactions }: TransactionMobileListProps) {
    const { t } = useTranslation();

    return (
        <div>
            {transactions.map((transaction) => (
                <div key={transaction.id} className="border-b last:border-0 border-accent p-4 space-y-4">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="font-medium font-mono text-xs">{transaction.transaction_code}</span>
                            <TypeBadge type={transaction.type} />
                        </div>
                        <div className="text-sm font-semibold">{formatCurrency(transaction.amount)}</div>
                        <div className="text-sm text-muted-foreground">{transaction.category || '-'}</div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('transactions.transaction_date')}:</span>
                        <span>{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                    </div>

                    {transaction.description && (
                        <div className="text-sm text-muted-foreground">{transaction.description}</div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Link
                            as="button"
                            href={route('transactions.edit', transaction.id)}
                            className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'h-8 px-2')}
                        >
                            <LucideSquarePen className="w-4 h-4 mr-1" />
                            {t('common.edit')}
                        </Link>
                        <TransactionDeleteDialog
                            transactionId={transaction.id}
                            transactionCode={transaction.transaction_code}
                            variant="sm"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
