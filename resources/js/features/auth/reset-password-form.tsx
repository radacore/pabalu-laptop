import { Button } from '@/components/ui/button';
import { FieldInput } from '@/components/form/field-input';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

interface ResetPasswordFormProps {
    token: string;
    email: string;
}

export default function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
    const { t } = useTranslation();

    const form = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        form.post(route('password.store'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
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
            />

            <FieldInput
                id="password"
                name="password"
                type="password"
                label={t('auth.password')}
                value={form.data.password}
                autoComplete="new-password"
                placeholder={t('auth.password_placeholder_new', { defaultValue: 'Enter new password' })}
                onChange={(e) => form.setData('password', e.target.value)}
                error={form.errors.password}
                required
                autoFocus
            />

            <FieldInput
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                label={t('auth.confirm_password')}
                value={form.data.password_confirmation}
                autoComplete="new-password"
                placeholder={t('auth.confirm_password_placeholder_new', { defaultValue: 'Confirm new password' })}
                onChange={(e) => form.setData('password_confirmation', e.target.value)}
                error={form.errors.password_confirmation}
                required
            />

            <Button
                variant="primary"
                className="w-full mt-4"
                type="submit"
                progress={form.processing}
                disabled={form.processing}
            >
                {t('auth.reset_password')}
            </Button>
        </form>
    );
}
