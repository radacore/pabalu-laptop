import { Chart } from '@/components/dashboard/chart';
import { StatCard } from '@/components/dashboard/stat-card';
import { Heading } from '@/components/ui/heading';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import {
    LucideUsers,
    LucideLaptop,
    LucideWrench,
    LucideTrendingUp,
    LucideTrendingDown,
    LucideActivity,
    LucidePackage,
    LucideArrowRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardStats {
    users: number;
    roles: number;
    permissions: number;
    total_laptops: number;
    in_stock_laptops: number;
    total_services: number;
    active_services: number;
    pending_services: number;
    total_income: string;
    total_expenses: string;
}

interface ChartDataPoint {
    name: string;
    income: number;
    expense: number;
}

interface DashboardProps {
    stats: DashboardStats;
    chartData: ChartDataPoint[];
    recentServices: Array<{
        id: number;
        tracking_code: string;
        status: string;
        customer: { name: string } | null;
        service_category: { name: string } | null;
        created_at: string;
    }>;
    recentTransactions: Array<{
        id: number;
        transaction_code: string;
        type: string;
        amount: string;
        description: string | null;
        transaction_date: string;
    }>;
}

const statusColors: Record<string, string> = {
    received: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    diagnosed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    waiting_parts: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    waiting_approval: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    repaired: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    pickup_ready: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

function formatCurrency(value: string | number | null) {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value));
}

export default function DashboardPage({ stats, chartData, recentServices, recentTransactions }: DashboardProps) {
    const { t } = useTranslation();
    const netIncome = Number(stats.total_income) - Number(stats.total_expenses);

    return (
        <>
            <Head title={t('navigation.dashboard')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <StatCard
                            title={t('dashboard.total_users')}
                            value={stats.users}
                            icon={LucideUsers}
                        />
                        <StatCard
                            title={t('dashboard.total_laptops')}
                            value={stats.total_laptops}
                            icon={LucideLaptop}
                        />
                        <StatCard
                            title={t('dashboard.active_services')}
                            value={stats.active_services}
                            icon={LucideWrench}
                        />
                        <StatCard
                            title={t('dashboard.pending_services')}
                            value={stats.pending_services}
                            icon={LucideActivity}
                        />
                        <StatCard
                            title={t('dashboard.total_income')}
                            value={formatCurrency(stats.total_income)}
                            icon={LucideTrendingUp}
                        />
                        <StatCard
                            title={t('dashboard.total_expenses')}
                            value={formatCurrency(stats.total_expenses)}
                            icon={LucideTrendingDown}
                        />
                        <StatCard
                            title={t('dashboard.revenue')}
                            value={formatCurrency(netIncome)}
                            icon={LucidePackage}
                        />
                        <StatCard
                            title={t('dashboard.in_stock_laptops')}
                            value={stats.in_stock_laptops}
                            icon={LucidePackage}
                        />
                    </div>

                    <div className="mt-8">
                        <Chart data={chartData} />
                    </div>

                    <div className="grid gap-6 mt-8 lg:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{t('dashboard.recent_services')}</CardTitle>
                                <Link
                                    href={route('services.index')}
                                    className={cn(buttonVariants({ variant: 'plain', size: 'sm' }), 'gap-2')}
                                >
                                    {t('dashboard.view_all')}
                                    <LucideArrowRight className="size-4" />
                                </Link>
                            </CardHeader>
                            <CardBody>
                                {recentServices.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">{t('common.no_data')}</p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('services.tracking_code') || 'Code'}</TableHead>
                                                <TableHead>{t('services.customer') || 'Customer'}</TableHead>
                                                <TableHead>{t('services.status') || 'Status'}</TableHead>
                                                <TableHead>{t('common.created_at') || 'Date'}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentServices.map((service) => (
                                                <TableRow key={service.id}>
                                                    <TableCell className="font-mono text-xs">
                                                        <Link href={route('services.edit', service.id)} className="hover:underline">
                                                            {service.tracking_code}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{service.customer?.name || '-'}</TableCell>
                                                    <TableCell>
                                                        <span className={cn(
                                                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                                            statusColors[service.status] || 'bg-gray-100 text-gray-800'
                                                        )}>
                                                            {t(`services.statuses.${service.status}`, service.status)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {new Date(service.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{t('dashboard.recent_transactions')}</CardTitle>
                                <Link
                                    href={route('transactions.index')}
                                    className={cn(buttonVariants({ variant: 'plain', size: 'sm' }), 'gap-2')}
                                >
                                    {t('dashboard.view_all')}
                                    <LucideArrowRight className="size-4" />
                                </Link>
                            </CardHeader>
                            <CardBody>
                                {recentTransactions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">{t('common.no_data')}</p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('transactions.transaction_code')}</TableHead>
                                                <TableHead>{t('transactions.type')}</TableHead>
                                                <TableHead>{t('transactions.amount')}</TableHead>
                                                <TableHead>{t('transactions.transaction_date')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentTransactions.map((tx) => (
                                                <TableRow key={tx.id}>
                                                    <TableCell className="font-mono text-xs">{tx.transaction_code}</TableCell>
                                                    <TableCell>
                                                        <span className={cn(
                                                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                                            tx.type === 'income'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                                : tx.type === 'expense'
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                        )}>
                                                            {t(`transactions.types.${tx.type}`)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{formatCurrency(tx.amount)}</TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {new Date(tx.transaction_date).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('navigation.dashboard')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

DashboardPage.layout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;
