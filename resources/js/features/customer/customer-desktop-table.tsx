import { Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { LucideArrowDown, LucideArrowUp, LucideArrowUpDown, LucideSquarePen } from 'lucide-react';
import { Customer } from './types';
import { CustomerDeleteDialog } from './customer-delete-dialog';
import { useTranslation } from 'react-i18next';

interface CustomerDesktopTableProps {
    customers: Customer[];
    state?: { search?: string, sort?: string };
}

export function CustomerDesktopTable({ customers, state }: CustomerDesktopTableProps) {
    const { t } = useTranslation();

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableHeader label={t('customers.name')} sortKey="name" state={state} />
                        <SortableHeader label={t('customers.phone')} sortKey="phone" state={state} />
                        <TableHead>{t('customers.note')}</TableHead>
                        <SortableHeader label={t('customers.created_at')} sortKey="created_at" state={state} />
                        <TableHead>{t('users.status', { defaultValue: 'Status' })}</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell>{customer.phone}</TableCell>
                            <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                                {customer.note || '-'}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {new Date(customer.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                {customer.user.is_active ? (
                                    <Badge variant="success">{t('customers.active', { defaultValue: 'Active' })}</Badge>
                                ) : (
                                    <Badge variant="warning">{t('customers.inactive', { defaultValue: 'Inactive' })}</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Link
                                        as="button"
                                        href={route('customers.edit', customer.id)}
                                        className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
                                    >
                                        <LucideSquarePen className="size-4" />
                                        <span className="hidden xl:inline">{t('common.edit')}</span>
                                    </Link>
                                    <CustomerDeleteDialog
                                        customerId={customer.id}
                                        customerName={customer.name}
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

function SortableHeader({ label, sortKey, state }: { label: string, sortKey: string, state?: { search?: string, sort?: string } }) {
    const { sort, search } = state ?? {};

    const isSorted = sort === sortKey || sort === `-${sortKey}`;
    const direction = sort === `-${sortKey}` ? 'desc' : 'asc';

    const handleSort = () => {
        const newSort = sort === sortKey ? `-${sortKey}` : sortKey;

        router.get(
            route('customers.index'),
            {
                sort: newSort,
                search: search,
            },
            { preserveState: true }
        );
    };

    return (
        <TableHead
            className="cursor-pointer hover:bg-muted/50 transition-colors select-none"
            onClick={handleSort}
        >
            <div className="flex items-center gap-2 group">
                {label}
                <span className={cn('text-muted-foreground', isSorted ? 'text-primary' : 'opacity-0 group-hover:opacity-50')}>
                    {isSorted ? (
                        direction === 'asc' ? <LucideArrowUp className="size-3" /> : <LucideArrowDown className="size-3" />
                    ) : (
                        <LucideArrowUpDown className="size-3" />
                    )}
                </span>
            </div>
        </TableHead>
    );
}
