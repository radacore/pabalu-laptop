import { Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { LucideArrowDown, LucideArrowUp, LucideArrowUpDown, LucideSquarePen } from 'lucide-react';
import { Laptop } from './types';
import { LaptopDeleteDialog } from './laptop-delete-dialog';
import { useTranslation } from 'react-i18next';

interface LaptopDesktopTableProps {
    laptops: Laptop[];
    state?: { search?: string, sort?: string, brand_id?: string };
}

export function LaptopDesktopTable({ laptops, state }: LaptopDesktopTableProps) {
    const { t } = useTranslation();

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableHeader label={t('laptops.model_name', { defaultValue: 'Model Name' })} sortKey="model_name" state={state} />
                        <SortableHeader label={t('laptops.serial_number', { defaultValue: 'Serial Number' })} sortKey="serial_number" state={state} />
                        <TableHead>{t('laptops.brand', { defaultValue: 'Brand' })}</TableHead>
                        <SortableHeader label={t('laptops.condition', { defaultValue: 'Condition' })} sortKey="condition" state={state} />
                        <SortableHeader label={t('laptops.status', { defaultValue: 'Status' })} sortKey="status" state={state} />
                        <SortableHeader label={t('laptops.purchase_price', { defaultValue: 'Purchase Price' })} sortKey="purchase_price" state={state} />
                        <SortableHeader label={t('laptops.selling_price', { defaultValue: 'Selling Price' })} sortKey="selling_price" state={state} />
                        <TableHead className="w-[1%] whitespace-nowrap"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {laptops.map((laptop) => (
                        <TableRow key={laptop.id}>
                            <TableCell className="font-medium">{laptop.model_name}</TableCell>
                            <TableCell className="text-muted-foreground">{laptop.serial_number || '-'}</TableCell>
                            <TableCell>{laptop.brand?.name || '-'}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{formatCondition(laptop.condition, t)}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={statusVariant(laptop.status)}>{formatStatus(laptop.status, t)}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{formatMoney(laptop.purchase_price)}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{formatMoney(laptop.selling_price)}</TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Link
                                        as="button"
                                        href={route('laptops.edit', laptop.id)}
                                        className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
                                    >
                                        <LucideSquarePen className="size-4" />
                                        <span className="hidden xl:inline">{t('common.edit')}</span>
                                    </Link>
                                    <LaptopDeleteDialog
                                        laptopId={laptop.id}
                                        laptopName={laptop.model_name}
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

function SortableHeader({ label, sortKey, state }: { label: string, sortKey: string, state?: { search?: string, sort?: string, brand_id?: string } }) {
    const { sort, search, brand_id } = state ?? {};

    const isSorted = sort === sortKey || sort === `-${sortKey}`;
    const direction = sort === `-${sortKey}` ? 'desc' : 'asc';

    const handleSort = () => {
        const newSort = sort === sortKey ? `-${sortKey}` : sortKey;

        router.get(
            route('laptops.index'),
            {
                sort: newSort,
                search: search,
                brand_id: brand_id,
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

function formatMoney(value: string | null): string {
    if (!value) {
        return '-';
    }

    return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatCondition(value: string, t: any): string {
    return t(`laptops.conditions.${value}`, { defaultValue: value.replaceAll('_', ' ') });
}

function formatStatus(value: string, t: any): string {
    return t(`laptops.statuses.${value}`, { defaultValue: value.replaceAll('_', ' ') });
}

function statusVariant(status: string) {
    if (status === 'available') {
        return 'success';
    }

    if (status === 'sold') {
        return 'secondary';
    }

    return 'warning';
}
