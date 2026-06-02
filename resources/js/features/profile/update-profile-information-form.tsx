import { FieldInput } from '@/components/form/field-input';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useForm, usePage } from '@inertiajs/react';
import { LucideSave } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useConfirmDialogStore } from '@/stores/confirm-dialog-store';

interface UpdateProfileInformationProps {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: UpdateProfileInformationProps) {
    const user = usePage().props.auth.user;
    const { t } = useTranslation();
    const { show } = useConfirmDialogStore();

    const form = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        handleUpdate();
    };

    const handleUpdate = () => {
        show({
            title: t('profile.update_profile_confirm'),
            description: t('profile.update_profile_confirm_description', { defaultValue: 'Are you sure you want to update your profile information? This action will save all changes.' }),
            variant: 'info',
            confirmText: t('common.confirm_update'),
            onConfirm: () => {
                form.patch(route('profile.update'));
            },
        });
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{t('profile.profile_information')}</CardTitle>
                <CardDescription>
                    {t('profile.profile_information_description', { defaultValue: "Update your account's profile information and email address." })}
                </CardDescription>
            </CardHeader>
            <CardBody>
                <form onSubmit={submit} className="space-y-6">
                    <FieldInput
                        id="name"
                        name="name"
                        label={t('users.name')}
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        required
                        autoFocus
                        autoComplete="name"
                        placeholder={t('users.name_placeholder')}
                        error={form.errors.name}
                    />

                    <FieldInput
                        id="email"
                        name="email"
                        type="email"
                        label={t('auth.email')}
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder={t('auth.email_placeholder')}
                        error={form.errors.email}
                    />

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div>
                            <p className="mt-2 text-sm text-foreground">
                                {t('auth.email_unverified')}
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="rounded-md text-sm text-muted underline hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                >
                                    {t('auth.click_to_resend_verification')}
                                </Link>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mt-2 text-sm font-medium text-green-600">
                                    {t('auth.verification_link_sent_new', { defaultValue: 'A new verification link has been sent to your email address.' })}
                                </div>
                            )}
                        </div>
                    )}

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
