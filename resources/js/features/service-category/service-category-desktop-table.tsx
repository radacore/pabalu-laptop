import { Link, router } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { LucideArrowDown, LucideArrowUp, LucideArrowUpDown, LucideSquarePen } from 'lucide-react';
import { ServiceCategory } from './types';
import { ServiceCategoryDeleteDialog } from './service-category-delete-dialog';
import { useTranslation } from 'react-i18next';

interface ServiceCategoryDesktopTableProps {
    serviceCategories: ServiceCategory[];
    state?: { search?: string, sort?: string };
}

export function ServiceCategoryDesktopTable({ serviceCategories, state }: ServiceCategoryDesktopTableProps) {
    const { t } = useTranslation();

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableHeader label={t('service_categories.name')} sortKey="name" state={state} />
                        <TableHead>{t('service_categories.description')}</TableHead>
                        <SortableHeader label={t('service_categories.created_at')} sortKey="created_at" state={state} />
                        <TableHead className="w-[1%] whitespace-nowrap"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {serviceCategories.map((serviceCategory) => (
                        <TableRow key={serviceCategory.id}>
                            <TableCell className="font-medium">{serviceCategory.name}</TableCell>
                            <TableCell className="text-muted-foreground">{serviceCategory.description || '-'}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {new Date(serviceCategory.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Link
                                        as="button"
                                        href={route('service-categories.edit', serviceCategory.id)}
                                        className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
                                    >
                                        <LucideSquarePen className="size-4" />
                                        <span className="hidden xl:inline">{t('common.edit')}</span>
                                    </Link>
                                    <ServiceCategoryDeleteDialog
                                        serviceCategoryId={serviceCategory.id}
                                        serviceCategoryName={serviceCategory.name}
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
            route('service-categories.index'),
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
