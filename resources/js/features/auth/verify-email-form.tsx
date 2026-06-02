import { Button, buttonVariants } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

export default function VerifyEmailForm({ status }: { status?: string }) {
    const { t } = useTranslation();
    const form = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        form.post(route('verification.send'));
    };

    return (
        <div className="space-y-6">
            {status === 'verification-link-sent' && (
                <div className="text-sm font-medium text-green-600">
                    {t('auth.verification_link_sent', { defaultValue: 'A new verification link has been sent to the email address you provided during registration.' })}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Button
                    variant="primary"
                    type="submit"
                    size="md"
                    className="w-full"
                    progress={form.processing}
                    disabled={form.processing}
                >
                    {t('auth.resend_verification')}
                </Button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className={cn(buttonVariants({ variant: 'plain' }), 'w-full')}
                >
                    {t('auth.logout')}
                </Link>
            </form>
        </div>
    );
}
