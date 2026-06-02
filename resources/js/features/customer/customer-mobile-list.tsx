import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { LucideSquarePen } from 'lucide-react';
import { Customer } from './types';
import { CustomerDeleteDialog } from './customer-delete-dialog';
import { useTranslation } from 'react-i18next';

interface CustomerMobileListProps {
    customers: Customer[];
}

export function CustomerMobileList({ customers }: CustomerMobileListProps) {
    const { t } = useTranslation();

    return (
        <div>
            {customers.map((customer) => (
                <div key={customer.id} className="border-b last:border-0 border-accent p-4 space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="font-medium truncate mr-2">{customer.name}</div>
                            <div className="text-sm text-muted-foreground break-all">{customer.phone}</div>
                        </div>
                        {customer.user.is_active ? (
                            <Badge variant="success" className="shrink-0">
                                {t('customers.active', { defaultValue: 'Active' })}
                            </Badge>
                        ) : (
                            <Badge variant="warning" className="shrink-0">
                                {t('customers.inactive', { defaultValue: 'Inactive' })}
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-start justify-between gap-4 text-sm">
                        <span className="text-muted-foreground">{t('customers.note')}:</span>
                        <span className="text-right">{customer.note || '-'}</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Link
                            as="button"
                            href={route('customers.edit', customer.id)}
                            className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'h-8 px-2')}
                        >
                            <LucideSquarePen className="w-4 h-4 mr-1" />
                            {t('common.edit')}
                        </Link>
                        <CustomerDeleteDialog
                            customerId={customer.id}
                            customerName={customer.name}
                            variant="sm"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
