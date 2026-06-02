import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PaginationLinks } from '@/components/pagination-links';
import { Head, Link, router } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { LucideCirclePlus, LucideSearch } from 'lucide-react';
import { Heading } from '@/components/ui/heading';
import { ServiceDesktopTable, ServiceIndexPageProps, ServiceMobileList } from '@/features/service';
import { FieldSelect } from '@/components/form/field-select';
import { Input } from '@/components/ui/input';
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';

export default function ServiceIndexPage({ services, statuses, state }: ServiceIndexPageProps & { state?: { search?: string, sort?: string, status?: string } }) {
    const { t } = useTranslation();
    const { search: currentSearch, sort, status } = state ?? { search: '', sort: '', status: '' };
    const [search, setSearch] = useState(currentSearch || '');
    const [statusFilter, setStatusFilter] = useState(status || '');

    const handleSearch = useCallback(
        debounce((value: string, currentSort: any, currentStatus: string) => {
            router.get(
                route('services.index'),
                {
                    search: value,
                    sort: currentSort,
                    status: currentStatus || undefined,
                },
                { preserveState: true, replace: true }
            );
        }, 300),
        []
    );

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        handleSearch(value, sort, statusFilter);
    };

    const onStatusChange = (value: string) => {
        const nextStatus = value === 'all' ? '' : value;
        setStatusFilter(nextStatus);
        router.get(
            route('services.index'),
            {
                search,
                sort,
                status: nextStatus || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    return (
        <>
            <Head title={t('services.title', { defaultValue: 'Services' })} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="text-start w-full">
                                <CardTitle>{t('services.title', { defaultValue: 'Services' })}</CardTitle>
                                <CardDescription>{t('services.description', { defaultValue: 'Manage service requests, updates, parts, and photos' })}</CardDescription>
                            </div>
                            <div className="flex flex-col-reverse md:flex-row gap-4 w-full justify-end">
                                <div className="relative w-full md:w-64">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                        <LucideSearch className="size-4" />
                                    </div>
                                    <Input
                                        placeholder={t('services.search_placeholder', { defaultValue: 'Search services...' })}
                                        className="pl-9"
                                        value={search}
                                        onChange={onSearchChange}
                                    />
                                </div>
                                <div className="w-full md:w-56">
                                    <FieldSelect
                                        name="status_filter"
                                        value={statusFilter || 'all'}
                                        onValueChange={(value) => onStatusChange(value as string)}
                                        options={[
                                            { value: 'all', label: t('services.all_statuses', { defaultValue: 'All statuses' }) },
                                            ...statuses.map((status) => ({ value: status.value, label: t(`services.statuses.${status.value}`, { defaultValue: status.label }) })),
                                        ]}
                                    />
                                </div>
                                <Link
                                    as="button"
                                    href={route('services.create')}
                                    className={cn(buttonVariants({ variant: 'primary' }), 'w-fit text-nowrap self-end md:self-auto')}
                                >
                                    <LucideCirclePlus />
                                    {t('services.create', { defaultValue: 'Create Service' })}
                                </Link>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0">
                            <div className="hidden md:block">
                                <ServiceDesktopTable services={services.data} state={state} />
                            </div>
                            <div className="md:hidden">
                                <ServiceMobileList services={services.data} />
                            </div>
                        </CardBody>
                        <CardFooter className="flex justify-center">
                            <PaginationLinks paginator={services} />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}

const IndexLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout header={<Heading size="sm">{t('services.title', { defaultValue: 'Services' })}</Heading>}>
            {children}
        </AuthenticatedLayout>
    );
};

ServiceIndexPage.layout = (page: any) => <IndexLayout>{page}</IndexLayout>;
