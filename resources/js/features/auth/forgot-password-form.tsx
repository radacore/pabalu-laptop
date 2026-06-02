import { Button } from '@/components/ui/button';
import { FieldInput } from '@/components/form/field-input';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordForm({ status }: { status?: string }) {
    const { t } = useTranslation();

    const form = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        form.post(route('password.email'));
    };

    return (
        <div className="space-y-6">
            {status && (
                <div className="text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <FieldInput
                    id="email"
                    name="email"
                    type="email"
                    label={t('auth.email')}
                    value={form.data.email}
                    autoComplete="username"
                    placeholder={t('auth.email_placeholder')}
                    onChange={(e) => form.setData('email', e.target.value)}
                    error={form.errors.email}
                    required
                    autoFocus
                />

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    progress={form.processing}
                    disabled={form.processing}
                >
                    {t('auth.send_reset_link')}
                </Button>
            </form>
        </div>
    );
}
