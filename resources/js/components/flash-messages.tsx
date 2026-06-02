'use client';

import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toastManager } from '@/components/ui/toast';

interface FlashData {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

const FLASH_TITLES: Record<string, string> = {
    success: 'flash.success',
    error: 'flash.error',
    warning: 'flash.warning',
    info: 'flash.info',
};

export function FlashMessages() {
    const { t } = useTranslation();
    const props = usePage().props;
    const flash = (props as unknown as { flash?: FlashData }).flash;
    const lastFlashRef = useRef<string | null>(null);

    useEffect(() => {
        const flashKey = JSON.stringify(flash);
        
        if (flashKey === lastFlashRef.current) {
            return;
        }
        lastFlashRef.current = flashKey;

        const types = ['success', 'error', 'warning', 'info'] as const;

        types.forEach((type) => {
            const message = flash?.[type];
            if (message) {
                const toastId = `${type}-${Date.now()}`;
                toastManager.add({
                    id: toastId,
                    type,
                    title: t(FLASH_TITLES[type]),
                    description: message,
                    timeout: 2500,
                    actionProps: {
                        children: t('flash.dismiss'),
                        onClick: () => toastManager.close(toastId),
                    },
                });
            }
        });
    }, [flash, t]);

    return null;
}
