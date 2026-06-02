import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/utils/cn';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, Clock, Package, Search, XCircle } from 'lucide-react';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

type ServiceStatus = 'received' | 'diagnosed' | 'in_progress' | 'waiting_parts' | 'waiting_approval' | 'repaired' | 'pickup_ready' | 'completed' | 'cancelled';

interface TrackingServiceUpdate {
    id: number;
    content: string;
    old_status: ServiceStatus | null;
    new_status: ServiceStatus;
    is_customer_visible: boolean;
    created_at: string;
}

interface TrackingServicePart {
    id: number;
    part_name: string;
    quantity: number;
    unit_price: string;
}

interface TrackingService {
    id: number;
    tracking_code: string;
    status: ServiceStatus;
    laptop_model: string | null;
    laptop_serial: string | null;
    estimated_cost: string | null;
    final_cost: string | null;
    down_payment: string | null;
    created_at: string;
    customer?: {
        id: number;
        name: string;
        phone: string;
    };
    laptop?: {
        id: number;
        model_name: string;
        serial_number?: string | null;
        brand?: {
            id: number;
            name: string;
        };
    } | null;
    service_category?: {
        id: number;
        name: string;
    };
    serviceCategory?: {
        id: number;
        name: string;
    };
    updates?: TrackingServiceUpdate[];
    parts?: TrackingServicePart[];
}

interface TrackingPageProps {
    service: TrackingService | null;
    statuses: Array<{ value: ServiceStatus; label: string }>;
}

const statusClasses: Record<ServiceStatus, string> = {
    received: 'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
    diagnosed: 'border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300',
    in_progress: 'border-indigo-200 bg-indigo-100 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300',
    waiting_parts: 'border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300',
    waiting_approval: 'border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300',
    repaired: 'border-teal-200 bg-teal-100 text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
    pickup_ready: 'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300',
    completed: 'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    cancelled: 'border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300',
};

export default function TrackingPage({ service }: TrackingPageProps) {
    const { t } = useTranslation();
    const form = useForm({
        tracking_code: service?.tracking_code ?? '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        const trackingCode = form.data.tracking_code.trim();
        if (!trackingCode) {
            return;
        }

        form.get(route('tracking.show', { tracking_code: trackingCode }));
    };

    return (
        <PublicLayout>
            <Head title={t('tracking.title')} />

            <main className="py-12 sm:py-16">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Search className="size-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t('tracking.title')}</h1>
                        <p className="mt-4 text-base text-muted">{t('tracking.description')}</p>
                    </div>

                    <Card className="mx-auto mt-8 max-w-2xl border-border bg-card">
                        <CardBody>
                            <form onSubmit={submit} className="space-y-4 sm:flex sm:items-end sm:gap-3 sm:space-y-0">
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="tracking_code" className="text-sm font-medium">
                                        {t('tracking.tracking_code')}
                                    </Label>
                                    <Input
                                        id="tracking_code"
                                        name="tracking_code"
                                        type="text"
                                        value={form.data.tracking_code}
                                        onChange={(event) => form.setData('tracking_code', event.target.value)}
                                        placeholder={t('tracking.tracking_code_placeholder')}
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={form.processing} data-disabled={form.processing} className="w-full sm:w-auto">
                                    <Search className="size-4" />
                                    {form.processing ? t('common.loading') : t('tracking.track_button')}
                                </Button>
                            </form>
                        </CardBody>
                    </Card>

                    {service && (
                        <div className="mt-10 space-y-6">
                            <ServiceDetails service={service} />
                            <UpdateTimeline updates={service.updates ?? []} />
                            <PartsTable parts={service.parts ?? []} />
                        </div>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}

function ServiceDetails({ service }: { service: TrackingService }) {
    const { t } = useTranslation();
    const laptopModel = service.laptop_model || service.laptop?.model_name || '-';
    const laptopSerial = service.laptop_serial || service.laptop?.serial_number || '-';
    const category = service.service_category?.name || service.serviceCategory?.name || '-';

    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <Package className="size-5 text-primary" />
                <CardTitle>{t('tracking.service_details')}</CardTitle>
                <StatusBadge status={service.status} />
            </CardHeader>
            <CardBody className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailItem label={t('tracking.tracking_code')} value={service.tracking_code} />
                    <DetailItem label={t('tracking.category')} value={category} />
                    <DetailItem label={t('tracking.status')} value={<StatusBadge status={service.status} />} />
                    <DetailItem label={t('tracking.laptop')} value={`${laptopModel} / ${laptopSerial}`} />
                    <DetailItem label={t('tracking.customer')} value={`${service.customer?.name || '-'} / ${service.customer?.phone || '-'}`} />
                    <DetailItem label={t('tracking.submitted')} value={formatDate(service.created_at)} />
                </div>
                <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
                    <DetailItem label={t('tracking.estimated_cost')} value={formatMoney(service.estimated_cost)} />
                    <DetailItem label={t('tracking.final_cost')} value={formatMoney(service.final_cost)} />
                    <DetailItem label={t('tracking.down_payment')} value={formatMoney(service.down_payment)} />
                </div>
            </CardBody>
        </Card>
    );
}

function UpdateTimeline({ updates }: { updates: TrackingServiceUpdate[] }) {
    const { t } = useTranslation();

    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <Clock className="size-5 text-primary" />
                <CardTitle>{t('tracking.update_history')}</CardTitle>
            </CardHeader>
            <CardBody>
                {updates.length === 0 ? (
                    <p className="text-sm text-muted">{t('tracking.no_updates')}</p>
                ) : (
                    <div className="space-y-6">
                        {updates.map((update, index) => (
                            <div key={update.id} className="relative flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-primary">
                                        {update.new_status === 'cancelled' ? <XCircle className="size-4" /> : <CheckCircle2 className="size-4" />}
                                    </div>
                                    {index < updates.length - 1 && <div className="mt-2 h-full min-h-10 w-px bg-border" />}
                                </div>
                                <div className="min-w-0 flex-1 pb-2">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm font-medium text-foreground">{formatDate(update.created_at)}</p>
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                                            {update.old_status && (
                                                <>
                                                    <span>{t('tracking.change_from')}</span>
                                                    <StatusBadge status={update.old_status} />
                                                    <span>{t('tracking.change_to')}</span>
                                                </>
                                            )}
                                            <StatusBadge status={update.new_status} />
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-muted">{update.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
}

function PartsTable({ parts }: { parts: TrackingServicePart[] }) {
    const { t } = useTranslation();

    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <Package className="size-5 text-primary" />
                <CardTitle>{t('tracking.parts_used')}</CardTitle>
            </CardHeader>
            <CardBody>
                {parts.length === 0 ? (
                    <p className="text-sm text-muted">{t('tracking.no_parts')}</p>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('tracking.part_name')}</TableHead>
                                    <TableHead>{t('tracking.quantity')}</TableHead>
                                    <TableHead>{t('tracking.unit_price')}</TableHead>
                                    <TableHead>{t('tracking.subtotal')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {parts.map((part) => (
                                    <TableRow key={part.id}>
                                        <TableCell className="font-medium">{part.part_name}</TableCell>
                                        <TableCell>{part.quantity}</TableCell>
                                        <TableCell>{formatMoney(part.unit_price)}</TableCell>
                                        <TableCell>{formatMoney(String(part.quantity * Number(part.unit_price)))}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardBody>
        </Card>
    );
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-border bg-background p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
            <div className="mt-2 break-words text-sm font-medium text-foreground">{value}</div>
        </div>
    );
}

function StatusBadge({ status }: { status: ServiceStatus }) {
    const { t } = useTranslation();

    return (
        <Badge className={cn('w-fit capitalize', statusClasses[status])}>
            {t(`services.statuses.${status}`, { defaultValue: formatStatus(status) })}
        </Badge>
    );
}

function formatStatus(status: ServiceStatus): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMoney(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value));
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}
