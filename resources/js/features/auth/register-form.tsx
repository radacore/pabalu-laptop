import { Button } from '@/components/ui/button';
import { FieldInput } from '@/components/form/field-input';
import { Text, TextLink } from '@/components/ui/text';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function RegisterForm() {
    const { t } = useTranslation();

    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        form.post(route('register'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <form onSubmit={submit} className="space-y-4">
                <FieldInput
                    id="name"
                    name="name"
                    type="text"
                    label={t('users.name')}
                    value={form.data.name}
                    autoComplete="name"
                    placeholder={t('users.name_placeholder')}
                    onChange={(e) => form.setData('name', e.target.value)}
                    error={form.errors.name}
                    required
                    autoFocus
                />

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
                    placeholder={t('auth.password_placeholder')}
                    onChange={(e) => form.setData('password', e.target.value)}
                    error={form.errors.password}
                    required
                />

                <FieldInput
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    label={t('auth.confirm_password')}
                    value={form.data.password_confirmation}
                    autoComplete="new-password"
                    placeholder={t('auth.confirm_password_placeholder', { defaultValue: 'Confirm your password' })}
                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                    error={form.errors.password_confirmation}
                    required
                />

                <Button
                    variant="primary"
                    type="submit"
                    className="w-full mt-4"
                    size="md"
                    progress={form.processing}
                    disabled={form.processing}
                >
                    {t('auth.register')}
                </Button>
            </form>

            <Text className="text-center mt-6">
                {t('auth.already_registered')} <TextLink href={route('login')}>{t('auth.login')}</TextLink>
            </Text>
        </>
    );
}
