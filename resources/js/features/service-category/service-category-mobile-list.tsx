import { Link } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { LucideSquarePen } from 'lucide-react';
import { ServiceCategory } from './types';
import { ServiceCategoryDeleteDialog } from './service-category-delete-dialog';
import { useTranslation } from 'react-i18next';

interface ServiceCategoryMobileListProps {
    serviceCategories: ServiceCategory[];
}

export function ServiceCategoryMobileList({ serviceCategories }: ServiceCategoryMobileListProps) {
    const { t } = useTranslation();

    return (
        <div>
            {serviceCategories.map((serviceCategory) => (
                <div key={serviceCategory.id} className="border-b last:border-0 border-accent p-4 space-y-4">
                    <div className="space-y-1">
                        <div className="font-medium truncate mr-2">{serviceCategory.name}</div>
                        <div className="text-sm text-muted-foreground">{serviceCategory.description || '-'}</div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('service_categories.created_at')}:</span>
                        <span>{new Date(serviceCategory.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Link
                            as="button"
                            href={route('service-categories.edit', serviceCategory.id)}
                            className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'h-8 px-2')}
                        >
                            <LucideSquarePen className="w-4 h-4 mr-1" />
                            {t('common.edit')}
                        </Link>
                        <ServiceCategoryDeleteDialog
                            serviceCategoryId={serviceCategory.id}
                            serviceCategoryName={serviceCategory.name}
                            variant="sm"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
