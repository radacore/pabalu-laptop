import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { LucideSquarePen } from 'lucide-react';
import { Service } from './types';
import { ServiceDeleteDialog } from './service-delete-dialog';
import { formatStatus, statusVariant } from './service-desktop-table';
import { useTranslation } from 'react-i18next';

interface ServiceMobileListProps {
    services: Service[];
}

export function ServiceMobileList({ services }: ServiceMobileListProps) {
    const { t } = useTranslation();

    return (
        <div>
            {services.map((service) => (
                <div key={service.id} className="border-b last:border-0 border-accent p-4 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1 min-w-0">
                            <div className="font-medium truncate mr-2">{service.tracking_code}</div>
                            <div className="text-sm text-muted-foreground break-all">{service.customer?.name || '-'}</div>
                        </div>
                        <Badge variant={statusVariant(service.status)} className="shrink-0">
                            {formatStatus(service.status, t)}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('services.laptop_model', { defaultValue: 'Laptop Model' })}:</span>
                        <span>{service.laptop_model || service.laptop?.model_name || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('services.service_category', { defaultValue: 'Service Category' })}:</span>
                        <span>{service.service_category?.name || service.serviceCategory?.name || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('services.estimated_cost', { defaultValue: 'Estimated Cost' })}:</span>
                        <span>{formatMoney(service.estimated_cost)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('services.created_at', { defaultValue: 'Created At' })}:</span>
                        <span>{new Date(service.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Link
                            as="button"
                            href={route('services.edit', service.id)}
                            className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'h-8 px-2')}
                        >
                            <LucideSquarePen className="w-4 h-4 mr-1" />
                            {t('common.edit')}
                        </Link>
                        <ServiceDeleteDialog
                            serviceId={service.id}
                            serviceName={service.tracking_code}
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

    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value));
}
