import { Button } from '@/components/ui/button';
import { FieldInput } from '@/components/form/field-input';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function ConfirmPasswordForm() {
    const { t } = useTranslation();
    const form = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        form.post(route('password.confirm'), {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <FieldInput
                id="password"
                name="password"
                type="password"
                label={t('auth.password')}
                value={form.data.password}
                placeholder={t('auth.password_placeholder')}
                onChange={(e) => form.setData('password', e.target.value)}
                error={form.errors.password}
                required
                autoFocus
            />

            <Button
                variant="primary"
                className="w-full"
                type="submit"
                progress={form.processing}
                disabled={form.processing}
            >
                {t('common.confirm')}
            </Button>
        </form>
    );
}
