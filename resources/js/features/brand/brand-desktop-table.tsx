import { Link, router } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { LucideArrowDown, LucideArrowUp, LucideArrowUpDown, LucideSquarePen } from 'lucide-react';
import { Brand } from './types';
import { BrandDeleteDialog } from './brand-delete-dialog';
import { useTranslation } from 'react-i18next';

interface BrandDesktopTableProps {
    brands: Brand[];
    state?: { search?: string, sort?: string };
}

export function BrandDesktopTable({ brands, state }: BrandDesktopTableProps) {
    const { t } = useTranslation();

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableHeader label={t('brands.name')} sortKey="name" state={state} />
                        <TableHead>{t('brands.description')}</TableHead>
                        <SortableHeader label={t('brands.created_at')} sortKey="created_at" state={state} />
                        <TableHead className="w-[1%] whitespace-nowrap"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {brands.map((brand) => (
                        <TableRow key={brand.id}>
                            <TableCell className="font-medium">{brand.name}</TableCell>
                            <TableCell className="text-muted-foreground">{brand.description || '-'}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {new Date(brand.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Link
                                        as="button"
                                        href={route('brands.edit', brand.id)}
                                        className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
                                    >
                                        <LucideSquarePen className="size-4" />
                                        <span className="hidden xl:inline">{t('common.edit')}</span>
                                    </Link>
                                    <BrandDeleteDialog
                                        brandId={brand.id}
                                        brandName={brand.name}
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
            route('brands.index'),
            {
                sort: newSort,
                search: search
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
                <span className={cn("text-muted-foreground", isSorted ? "text-primary" : "opacity-0 group-hover:opacity-50")}>
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
