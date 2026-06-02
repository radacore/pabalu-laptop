import { Link } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { LucideSquarePen } from 'lucide-react';
import { Brand } from './types';
import { BrandDeleteDialog } from './brand-delete-dialog';
import { useTranslation } from 'react-i18next';

interface BrandMobileListProps {
    brands: Brand[];
}

export function BrandMobileList({ brands }: BrandMobileListProps) {
    const { t } = useTranslation();

    return (
        <div>
            {brands.map((brand) => (
                <div key={brand.id} className="border-b last:border-0 border-accent p-4 space-y-4">
                    <div className="space-y-1">
                        <div className="font-medium truncate mr-2">{brand.name}</div>
                        <div className="text-sm text-muted-foreground">{brand.description || '-'}</div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('brands.created_at')}:</span>
                        <span>{new Date(brand.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Link
                            as="button"
                            href={route('brands.edit', brand.id)}
                            className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'h-8 px-2')}
                        >
                            <LucideSquarePen className="w-4 h-4 mr-1" />
                            {t('common.edit')}
                        </Link>
                        <BrandDeleteDialog
                            brandId={brand.id}
                            brandName={brand.name}
                            variant="sm"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
