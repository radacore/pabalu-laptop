import { FieldInput } from '@/components/form/field-input';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { LucideSave } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useConfirmDialogStore } from '@/stores/confirm-dialog-store';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    const { show } = useConfirmDialogStore();

    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        handleUpdate();
    };

    const handleUpdate = () => {
        show({
            title: t('profile.update_password_confirm'),
            description: t('profile.update_password_confirm_description', { defaultValue: 'Are you sure you want to update your password? This action will change your account password.' }),
            variant: 'warning',
            confirmText: t('common.confirm_update'),
            onConfirm: () => {
                form.put(route('password.update'), {
                    preserveScroll: true,
                    onSuccess: () => form.reset(),
                    onError: (errors) => {
                        if (errors.password) {
                            form.reset('password', 'password_confirmation');
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            form.reset('current_password');
                            currentPasswordInput.current?.focus();
                        }
                    },
                });
            },
        });
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{t('profile.update_password')}</CardTitle>
                <CardDescription>
                    {t('profile.update_password_description', { defaultValue: 'Ensure your account is using a long, random password to stay secure.' })}
                </CardDescription>
            </CardHeader>
            <CardBody>
                <form onSubmit={submit} className="space-y-6">
                    <FieldInput
                        id="current_password"
                        name="current_password"
                        ref={currentPasswordInput}
                        label={t('auth.current_password')}
                        value={form.data.current_password}
                        onChange={(e) => form.setData('current_password', e.target.value)}
                        type="password"
                        autoComplete="current-password"
                        placeholder={t('auth.current_password_placeholder')}
                        error={form.errors.current_password}
                    />

                    <FieldInput
                        id="password"
                        name="password"
                        ref={passwordInput}
                        label={t('auth.new_password')}
                        value={form.data.password}
                        onChange={(e) => form.setData('password', e.target.value)}
                        type="password"
                        autoComplete="new-password"
                        placeholder={t('auth.new_password_placeholder')}
                        error={form.errors.password}
                    />

                    <FieldInput
                        id="password_confirmation"
                        name="password_confirmation"
                        label={t('auth.confirm_password')}
                        value={form.data.password_confirmation}
                        onChange={(e) => form.setData('password_confirmation', e.target.value)}
                        type="password"
                        autoComplete="new-password"
                        placeholder={t('auth.confirm_new_password_placeholder', { defaultValue: 'Confirm your new password' })}
                        error={form.errors.password_confirmation}
                    />

                    <div className="flex items-center gap-4 mt-8">
                        <Button variant="primary" type="submit" disabled={form.processing}>
                            <LucideSave />
                            {t('common.save')}
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}
