import { Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { LucideArrowDown, LucideArrowUp, LucideArrowUpDown, LucideSquarePen } from 'lucide-react';
import { Service, ServiceStatus } from './types';
import { ServiceDeleteDialog } from './service-delete-dialog';
import { useTranslation } from 'react-i18next';

interface ServiceDesktopTableProps {
    services: Service[];
    state?: { search?: string, sort?: string, status?: string };
}

export function ServiceDesktopTable({ services, state }: ServiceDesktopTableProps) {
    const { t } = useTranslation();

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableHeader label={t('services.tracking_code', { defaultValue: 'Tracking Code' })} sortKey="tracking_code" state={state} />
                        <TableHead>{t('services.customer', { defaultValue: 'Customer' })}</TableHead>
                        <SortableHeader label={t('services.laptop_model', { defaultValue: 'Laptop Model' })} sortKey="laptop_model" state={state} />
                        <TableHead>{t('services.service_category', { defaultValue: 'Service Category' })}</TableHead>
                        <SortableHeader label={t('services.status', { defaultValue: 'Status' })} sortKey="status" state={state} />
                        <SortableHeader label={t('services.estimated_cost', { defaultValue: 'Estimated Cost' })} sortKey="estimated_cost" state={state} />
                        <SortableHeader label={t('services.created_at', { defaultValue: 'Created At' })} sortKey="created_at" state={state} />
                        <TableHead className="w-[1%] whitespace-nowrap"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {services.map((service) => (
                        <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.tracking_code}</TableCell>
                            <TableCell>{service.customer?.name || '-'}</TableCell>
                            <TableCell className="text-muted-foreground">{service.laptop_model || service.laptop?.model_name || '-'}</TableCell>
                            <TableCell>{service.service_category?.name || service.serviceCategory?.name || '-'}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant(service.status)}>{formatStatus(service.status, t)}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{formatMoney(service.estimated_cost)}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{new Date(service.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Link
                                        as="button"
                                        href={route('services.edit', service.id)}
                                        className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
                                    >
                                        <LucideSquarePen className="size-4" />
                                        <span className="hidden xl:inline">{t('common.edit')}</span>
                                    </Link>
                                    <ServiceDeleteDialog
                                        serviceId={service.id}
                                        serviceName={service.tracking_code}
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

function SortableHeader({ label, sortKey, state }: { label: string, sortKey: string, state?: { search?: string, sort?: string, status?: string } }) {
    const { sort, search, status } = state ?? {};
    const isSorted = sort === sortKey || sort === `-${sortKey}`;
    const direction = sort === `-${sortKey}` ? 'desc' : 'asc';

    const handleSort = () => {
        const newSort = sort === sortKey ? `-${sortKey}` : sortKey;

        router.get(
            route('services.index'),
            {
                sort: newSort,
                search,
                status,
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
                        direction === 'desc' ? <LucideArrowDown className="size-4" /> : <LucideArrowUp className="size-4" />
                    ) : (
                        <LucideArrowUpDown className="size-4" />
                    )}
                </span>
            </div>
        </TableHead>
    );
}

export function statusVariant(status: ServiceStatus): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'tertiary' {
    switch (status) {
        case 'received':
            return 'secondary';
        case 'diagnosed':
            return 'info';
        case 'in_progress':
            return 'primary';
        case 'waiting_parts':
        case 'waiting_approval':
            return 'warning';
        case 'repaired':
        case 'pickup_ready':
            return 'tertiary';
        case 'completed':
            return 'success';
        case 'cancelled':
            return 'danger';
    }
}

export function formatStatus(status: ServiceStatus, t: (key: string, options?: any) => string): string {
    return t(`services.statuses.${status}`, { defaultValue: status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) });
}

function formatMoney(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value));
}
