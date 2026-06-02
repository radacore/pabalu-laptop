import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { LucideSquarePen } from 'lucide-react';
import { Laptop } from './types';
import { LaptopDeleteDialog } from './laptop-delete-dialog';
import { useTranslation } from 'react-i18next';

interface LaptopMobileListProps {
    laptops: Laptop[];
}

export function LaptopMobileList({ laptops }: LaptopMobileListProps) {
    const { t } = useTranslation();

    return (
        <div>
            {laptops.map((laptop) => (
                <div key={laptop.id} className="border-b last:border-0 border-accent p-4 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1 min-w-0">
                            <div className="font-medium truncate mr-2">{laptop.model_name}</div>
                            <div className="text-sm text-muted-foreground break-all">{laptop.serial_number || '-'}</div>
                        </div>
                        <Badge variant={statusVariant(laptop.status)} className="shrink-0">
                            {formatStatus(laptop.status, t)}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('laptops.brand', { defaultValue: 'Brand' })}:</span>
                        <span>{laptop.brand?.name || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('laptops.condition', { defaultValue: 'Condition' })}:</span>
                        <span>{formatCondition(laptop.condition, t)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('laptops.purchase_price', { defaultValue: 'Purchase Price' })}:</span>
                        <span>{formatMoney(laptop.purchase_price)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('laptops.selling_price', { defaultValue: 'Selling Price' })}:</span>
                        <span>{formatMoney(laptop.selling_price)}</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Link
                            as="button"
                            href={route('laptops.edit', laptop.id)}
                            className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'h-8 px-2')}
                        >
                            <LucideSquarePen className="w-4 h-4 mr-1" />
                            {t('common.edit')}
                        </Link>
                        <LaptopDeleteDialog
                            laptopId={laptop.id}
                            laptopName={laptop.model_name}
                            variant="sm"
                        />
                    </div>
                </div>
            ))}
        </div>
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
