import { Button } from '@/components/ui/button';
import { FieldCheckbox } from '@/components/form/field-checkbox';
import { FieldInput } from '@/components/form/field-input';
import { Text, TextLink } from '@/components/ui/text';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

interface LoginFormProps {
    canResetPassword?: boolean;
}

export default function LoginForm({ canResetPassword }: LoginFormProps) {
    const { t } = useTranslation();

    const form = useForm({
        login: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        form.post(route('login'), {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <>
            <form onSubmit={submit} className="space-y-6">
                <FieldInput
                    id="login"
                    name="login"
                    type="text"
                    label={t('auth.phone_or_email')}
                    value={form.data.login}
                    autoComplete="username"
                    placeholder={t('auth.phone_or_email_placeholder')}
                    onChange={(e) => form.setData('login', e.target.value)}
                    error={form.errors.login}
                    required
                />

                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium leading-none text-foreground" htmlFor="password">
                            {t('auth.password')}
                        </label>
                        {canResetPassword && (
                            <TextLink href={route('password.request')}>
                                {t('auth.forgot_password_question')}
                            </TextLink>
                        )}
                    </div>
                    <FieldInput
                        id="password"
                        name="password"
                        type="password"
                        value={form.data.password}
                        autoComplete="current-password"
                        placeholder={t('auth.password_placeholder')}
                        onChange={(e) => form.setData('password', e.target.value)}
                        error={form.errors.password}
                        required
                    />
                </div>

                <FieldCheckbox
                    name="remember"
                    label={t('auth.remember_me')}
                    checked={form.data.remember}
                    onCheckedChange={(checked) => form.setData('remember', checked as boolean)}
                />

                <Button
                    variant="primary"
                    type="submit"
                    className="w-full"
                    size="md"
                    progress={form.processing}
                    disabled={form.processing}
                >
                    {t('auth.login')}
                </Button>
            </form>

            <Text className="text-center mt-6">
                {t('auth.no_account')} <TextLink href={route('register')}>{t('auth.register')}</TextLink>
            </Text>
        </>
    );
}
