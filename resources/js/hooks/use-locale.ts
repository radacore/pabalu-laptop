import { useTranslation as useI18nTranslation, UseTranslationOptions } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import type { LocaleData } from '@/types';

export function useLocale(namespace?: string, options?: UseTranslationOptions<string>) {
    const { t, i18n, ready } = useI18nTranslation(namespace, options);
    const { locale } = usePage().props as { locale: LocaleData };

    return {
        /** Translation function */
        t,
        /** i18next instance */
        i18n,
        /** Whether translations are loaded */
        ready,
        /** Current locale code (e.g., 'en', 'id') */
        currentLocale: locale?.current || 'en',
        /** Available locales with their info */
        availableLocales: locale?.available || {},
        /** URLs for switching locales */
        localeUrls: locale?.urls || {},
        /** Change language and navigate to localized URL */
        changeLanguage: (lang: string) => {
            if (locale?.urls[lang]) {
                window.location.href = locale.urls[lang];
            }
        },
    };
}

export default useLocale;
