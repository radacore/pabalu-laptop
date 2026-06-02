import { Link } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { LucideSquarePen } from 'lucide-react';
import { LaptopSource } from './types';
import { LaptopSourceDeleteDialog } from './laptop-source-delete-dialog';
import { useTranslation } from 'react-i18next';

interface LaptopSourceMobileListProps {
    laptopSources: LaptopSource[];
}

export function LaptopSourceMobileList({ laptopSources }: LaptopSourceMobileListProps) {
    const { t } = useTranslation();

    return (
        <div>
            {laptopSources.map((laptopSource) => (
                <div key={laptopSource.id} className="border-b last:border-0 border-accent p-4 space-y-4">
                    <div className="space-y-1">
                        <div className="font-medium truncate mr-2">{laptopSource.name}</div>
                        <div className="text-sm text-muted-foreground">{laptopSource.description || '-'}</div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('laptop_sources.created_at')}:</span>
                        <span className="text-muted-foreground">{new Date(laptopSource.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Link
                            as="button"
                            href={route('laptop-sources.edit', laptopSource.id)}
                            className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'h-8 px-2')}
                        >
                            <LucideSquarePen className="w-4 h-4 mr-1" />
                            {t('common.edit')}
                        </Link>
                        <LaptopSourceDeleteDialog
                            laptopSourceId={laptopSource.id}
                            laptopSourceName={laptopSource.name}
                            variant="sm"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
