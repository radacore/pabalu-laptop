import { Button } from '@/components/ui/button';
import { LucideTrash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useConfirmDialogStore } from '@/stores/confirm-dialog-store';
import { useTranslation } from 'react-i18next';

interface ServiceCategoryDeleteDialogProps {
    serviceCategoryId: number;
    serviceCategoryName: string;
    disabled?: boolean;
    variant?: 'sm' | 'default';
}

export function ServiceCategoryDeleteDialog({
    serviceCategoryId,
    serviceCategoryName,
    disabled = false,
    variant = 'default',
}: ServiceCategoryDeleteDialogProps) {
    const { show } = useConfirmDialogStore();
    const { t } = useTranslation();

    const handleClick = () => {
        show({
            title: t('common.are_you_sure'),
            description: t('service_categories.delete_confirm', {
                name: serviceCategoryName,
                defaultValue: `This will permanently delete the category "${serviceCategoryName}". This action cannot be undone.`,
            }),
            variant: 'danger',
            confirmText: t('common.delete'),
            onConfirm: () => {
                router.delete(route('service-categories.destroy', serviceCategoryId));
            },
        });
    };

    return (
        <Button
            variant="danger"
            size="sm"
            className={variant === 'sm' ? 'h-8 px-2' : ''}
            disabled={disabled}
            onClick={handleClick}
        >
            <LucideTrash2 className={variant === 'sm' ? 'w-4 h-4 mr-1' : 'size-4'} />
            {variant === 'sm' ? t('common.delete') : <span className="hidden xl:inline">{t('common.delete')}</span>}
        </Button>
    );
}
