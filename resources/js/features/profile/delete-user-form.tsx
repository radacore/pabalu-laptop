import { FieldInput } from '@/components/form/field-input';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideTrash2 } from 'lucide-react';
import { useConfirmDialogStore } from '@/stores/confirm-dialog-store';
import { useTranslation } from 'react-i18next';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [password, setPassword] = useState('');
    const { show, update, hide } = useConfirmDialogStore();
    const { t } = useTranslation();

    const {
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setPassword('');
        clearErrors();
        
        show({
            title: t('profile.delete_account_confirm'),
            description: t('profile.delete_account_confirm_description', { defaultValue: 'Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.' }),
            variant: 'danger',
            confirmText: t('common.delete_account'),
            confirmDisabled: true,
            content: (
                <FieldInput
                    id="password"
                    name="password"
                    type="password"
                    ref={passwordInput}
                    value={password}
                    onChange={(e) => {
                        const val = e.target.value;
                        setPassword(val);
                        setData('password', val);
                        update({ confirmDisabled: !val });
                    }}
                    autoFocus
                    placeholder={t('auth.password_placeholder')}
                    error={errors.password}
                    className="mt-4"
                />
            ),
            onConfirm: () => {
                return new Promise<void>((resolve, reject) => {
                    destroy(route('profile.destroy'), {
                        preserveScroll: true,
                        onSuccess: () => {
                            hide();
                            resolve();
                        },
                        onError: () => {
                            passwordInput.current?.focus();
                            reject();
                        },
                        onFinish: () => {
                            reset();
                            setPassword('');
                        },
                    });
                });
            },
            onCancel: () => {
                clearErrors();
                reset();
                setPassword('');
            },
        });
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{t('profile.delete_account')}</CardTitle>
                <CardDescription>
                    {t('profile.delete_account_description', { defaultValue: 'Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.' })}
                </CardDescription>
            </CardHeader>
            <CardBody>
                <Button variant="danger" onClick={confirmUserDeletion}>
                    <LucideTrash2/>
                    {t('common.delete_account')}
                </Button>
            </CardBody>
        </Card>
    );
}
