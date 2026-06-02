import { PaginationLinks } from '@/components/pagination-links';
import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { cn } from '@/utils/cn';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2, Clock, LayoutDashboard, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ServiceStatus = 'received' | 'diagnosed' | 'in_progress' | 'waiting_parts' | 'waiting_approval' | 'repaired' | 'pickup_ready' | 'completed' | 'cancelled';

interface Customer {
    id: number;
    name: string;
}

interface Service {
    id: number;
    tracking_code: string;
    status: ServiceStatus;
    laptop_model: string | null;
    created_at: string;
    service_category?: { id: number; name: string } | null;
    serviceCategory?: { id: number; name: string } | null;
    laptop?: {
        id: number;
        model_name: string | null;
        brand?: { id: number; name: string } | null;
    } | null;
}

interface Paginator<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    first_page_url: string;
    last_page_url: string;
    current_page: number;
    last_page: number;
}

interface CustomerDashboardProps {
    customer: Customer | null;
    services: Paginator<Service>;
    stats: {
        total_services: number;
        active_services: number;
        completed_services: number;
    };
}

export default function CustomerDashboardPage({ customer, services, stats }: CustomerDashboardProps) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;
    const customerName = customer?.name ?? user.name;

    return (
        <>
            <Head title={t('customer_dashboard.title')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-6 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            {t('customer_dashboard.welcome', { name: customerName })}
                        </h1>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <StatCard
                            title={t('customer_dashboard.total_services')}
                            value={stats.total_services}
                            icon={LayoutDashboard}
                        />
                        <StatCard
                            title={t('customer_dashboard.active_services')}
                            value={stats.active_services}
                            icon={Clock}
                        />
                        <StatCard
                            title={t('customer_dashboard.completed_services')}
                            value={stats.completed_services}
                            icon={CheckCircle2}
                        />
                    </div>

                    <Card>
                        <CardHeader>
                            <Wrench className="size-5 text-primary" />
                            <CardTitle>{t('customer_dashboard.recent_services')}</CardTitle>
                            <CardDescription>{t('customer_dashboard.my_services')}</CardDescription>
                        </CardHeader>
                        <CardBody className={cn(services.data.length === 0 && 'py-12 text-center text-muted-foreground')}>
                            {services.data.length === 0 ? (
                                <p>{t('customer_dashboard.no_services')}</p>
                            ) : (
                                <>
                                    <div className="hidden md:block">
                                        <CustomerServicesTable services={services.data} />
                                    </div>
                                    <div className="md:hidden">
                                        <CustomerServicesList services={services.data} />
                                    </div>
                                </>
                            )}
                        </CardBody>
                        {services.data.length > 0 && (
                            <CardFooter className="flex justify-center">
                                <PaginationLinks paginator={services} />
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}

function CustomerServicesTable({ services }: { services: Service[] }) {
    const { t } = useTranslation();

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('services.tracking_code')}</TableHead>
                        <TableHead>{t('services.status')}</TableHead>
                        <TableHead>{t('services.service_category')}</TableHead>
                        <TableHead>{t('services.laptop_model')}</TableHead>
                        <TableHead>{t('services.created_at')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {services.map((service) => {
                        const trackingUrl = trackingServiceUrl(service.tracking_code);

                        return (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">
                                    <Link href={trackingUrl}>{service.tracking_code}</Link>
                                </TableCell>
                                <TableCell>
                                    <Link href={trackingUrl}>
                                        <StatusBadge status={service.status} />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link href={trackingUrl}>{serviceCategoryName(service)}</Link>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    <Link href={trackingUrl}>{laptopModelName(service)}</Link>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    <Link href={trackingUrl}>{formatDate(service.created_at)}</Link>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function CustomerServicesList({ services }: { services: Service[] }) {
    const { t } = useTranslation();

    return (
        <div>
            {services.map((service) => (
                <Link
                    key={service.id}
                    href={trackingServiceUrl(service.tracking_code)}
                    className="block border-b border-accent p-4 last:border-0"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-1">
                            <div className="truncate font-medium">{service.tracking_code}</div>
                            <div className="text-sm text-muted-foreground">{laptopModelName(service)}</div>
                        </div>
                        <StatusBadge status={service.status} />
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">{t('services.service_category')}</span>
                            <span>{serviceCategoryName(service)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">{t('services.created_at')}</span>
                            <span>{formatDate(service.created_at)}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

function StatusBadge({ status }: { status: ServiceStatus }) {
    const { t } = useTranslation();

    return (
        <Badge className={statusBadgeClassName(status)}>
            {t(`services.statuses.${status}`, { defaultValue: formatStatus(status) })}
        </Badge>
    );
}

function serviceCategoryName(service: Service): string {
    return service.service_category?.name ?? service.serviceCategory?.name ?? '-';
}

function laptopModelName(service: Service): string {
    if (service.laptop_model) {
        return service.laptop_model;
    }

    const brandName = service.laptop?.brand?.name;
    const modelName = service.laptop?.model_name;

    return [brandName, modelName].filter(Boolean).join(' ') || '-';
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString();
}

function formatStatus(status: ServiceStatus): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function trackingServiceUrl(trackingCode: string): string {
    return route().has('tracking.show') ? route('tracking.show', trackingCode) : '#';
}

function statusBadgeClassName(status: ServiceStatus): string {
    switch (status) {
        case 'received':
            return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
        case 'diagnosed':
            return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
        case 'in_progress':
            return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300';
        case 'waiting_parts':
            return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
        case 'waiting_approval':
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
        case 'repaired':
            return 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300';
        case 'pickup_ready':
            return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
        case 'completed':
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
        case 'cancelled':
            return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
    }
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('customer_dashboard.title')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

CustomerDashboardPage.layout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;
