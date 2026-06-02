import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PaginationLinks } from '@/components/pagination-links';
import { Head, Link, router } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { LucideCirclePlus, LucideSearch, LucideFilter } from 'lucide-react';
import { Heading } from '@/components/ui/heading';
import { TransactionDesktopTable, TransactionMobileList, TransactionIndexPageProps } from '@/features/transaction';
import { Input } from '@/components/ui/input';
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';

export default function TransactionIndexPage({ transactions, state }: TransactionIndexPageProps & { state?: { search?: string; sort?: string; type?: string } }) {
    const { t } = useTranslation();
    const { search: currentSearch, sort, type: currentType } = state ?? { search: '', sort: '', type: '' };
    const [search, setSearch] = useState(currentSearch || '');
    const [typeFilter, setTypeFilter] = useState(currentType || '');

    const handleFilter = useCallback(
        debounce((searchVal: string, typeVal: string, currentSort: any) => {
            router.get(
                route('transactions.index'),
                {
                    search: searchVal,
                    sort: currentSort,
                    type: typeVal,
                },
                { preserveState: true, replace: true }
            );
        }, 300),
        []
    );

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        handleFilter(value, typeFilter, sort);
    };

    const onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setTypeFilter(value);
        handleFilter(search, value, sort);
    };

    return (
        <>
            <Head title={t('transactions.title')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="text-start w-full">
                                <CardTitle>{t('transactions.title')}</CardTitle>
                                <CardDescription>{t('transactions.manage_description')}</CardDescription>
                            </div>
                            <div className="flex flex-col-reverse md:flex-row gap-4 w-full justify-end">
                                <div className="relative w-full md:w-64">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                        <LucideSearch className="size-4" />
                                    </div>
                                    <Input
                                        value={search}
                                        onChange={onSearchChange}
                                        placeholder={t('common.search')}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="relative w-full md:w-48">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                        <LucideFilter className="size-4" />
                                    </div>
                                    <select
                                        value={typeFilter}
                                        onChange={onTypeChange}
                                        className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">{t('transactions.type')}</option>
                                        <option value="income">{t('transactions.types.income')}</option>
                                        <option value="expense">{t('transactions.types.expense')}</option>
                                        <option value="transfer">{t('transactions.types.transfer')}</option>
                                    </select>
                                </div>
                                <Link
                                    as="button"
                                    href={route('transactions.create')}
                                    className={cn(buttonVariants({ variant: 'primary' }), 'w-full md:w-auto')}
                                >
                                    <LucideCirclePlus className="size-4" />
                                    {t('transactions.create')}
                                </Link>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="hidden md:block">
                                <TransactionDesktopTable transactions={transactions.data} state={state} />
                            </div>
                            <div className="md:hidden">
                                <TransactionMobileList transactions={transactions.data} />
                            </div>
                        </CardBody>
                        {transactions.last_page > 1 && (
                            <CardFooter>
                                <PaginationLinks paginator={transactions} />
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}

const IndexLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    return (
        <AuthenticatedLayout
            header={<Heading size="sm">{t('transactions.title')}</Heading>}
        >
            {children}
        </AuthenticatedLayout>
    );
};

TransactionIndexPage.layout = (page: any) => <IndexLayout>{page}</IndexLayout>;
