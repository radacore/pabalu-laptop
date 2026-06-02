import { Link, router } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { LucideArrowDown, LucideArrowUp, LucideArrowUpDown, LucideSquarePen } from 'lucide-react';
import { Transaction } from './types';
import { TransactionDeleteDialog } from './transaction-delete-dialog';
import { useTranslation } from 'react-i18next';

function SortableHeader({ label, sortKey, state }: { label: string; sortKey: string; state?: { search?: string; sort?: string } }) {
    const currentSort = state?.sort || '';
    const [column, direction] = currentSort.startsWith('-') ? [currentSort.slice(1), 'desc'] : [currentSort, 'asc'];
    const isActive = column === sortKey;

    const handleSort = () => {
        let newSort: string;
        if (!isActive) {
            newSort = sortKey;
        } else if (direction === 'asc') {
            newSort = `-${sortKey}`;
        } else {
            newSort = '';
        }
        router.get(route('transactions.index'), { search: state?.search, sort: newSort }, { preserveState: true, replace: true });
    };

    return (
        <TableHead>
            <button onClick={handleSort} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                {label}
                {isActive ? (
                    direction === 'asc' ? <LucideArrowUp className="size-4" /> : <LucideArrowDown className="size-4" />
                ) : (
                    <LucideArrowUpDown className="size-4 opacity-50" />
                )}
            </button>
        </TableHead>
    );
}

function TypeBadge({ type }: { type: string }) {
    const { t } = useTranslation();
    const colors: Record<string, string> = {
        income: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        expense: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        transfer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            colors[type] || 'bg-gray-100 text-gray-800'
        )}>
            {t(`transactions.types.${type}`)}
        </span>
    );
}

function formatCurrency(value: string | null) {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value));
}

interface TransactionDesktopTableProps {
    transactions: Transaction[];
    state?: { search?: string; sort?: string; type?: string };
}

export function TransactionDesktopTable({ transactions, state }: TransactionDesktopTableProps) {
    const { t } = useTranslation();

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableHeader label={t('transactions.transaction_code')} sortKey="transaction_code" state={state} />
                        <TableHead>{t('transactions.type')}</TableHead>
                        <TableHead>{t('transactions.category')}</TableHead>
                        <SortableHeader label={t('transactions.amount')} sortKey="amount" state={state} />
                        <TableHead>{t('transactions.description')}</TableHead>
                        <SortableHeader label={t('transactions.transaction_date')} sortKey="transaction_date" state={state} />
                        <TableHead className="w-[1%] whitespace-nowrap"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className="font-medium font-mono text-xs">{transaction.transaction_code}</TableCell>
                            <TableCell><TypeBadge type={transaction.type} /></TableCell>
                            <TableCell className="text-muted-foreground">{transaction.category || '-'}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(transaction.amount)}</TableCell>
                            <TableCell className="text-muted-foreground max-w-xs truncate">{transaction.description || '-'}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {new Date(transaction.transaction_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Link
                                        as="button"
                                        href={route('transactions.edit', transaction.id)}
                                        className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
                                    >
                                        <LucideSquarePen className="size-4" />
                                        <span className="hidden xl:inline">{t('common.edit')}</span>
                                    </Link>
                                    <TransactionDeleteDialog
                                        transactionId={transaction.id}
                                        transactionCode={transaction.transaction_code}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
