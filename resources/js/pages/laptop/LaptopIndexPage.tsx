import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PaginationLinks } from '@/components/pagination-links';
import { Head, Link, router } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { LucideCirclePlus, LucideSearch } from 'lucide-react';
import { Heading } from '@/components/ui/heading';
import { LaptopDesktopTable, LaptopIndexPageProps, LaptopMobileList } from '@/features/laptop';
import { FieldSelect } from '@/components/form/field-select';
import { Input } from '@/components/ui/input';
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';

export default function LaptopIndexPage({ laptops, brands, state }: LaptopIndexPageProps & { state?: { search?: string, sort?: string, brand_id?: string } }) {
    const { t } = useTranslation();
    const { search: currentSearch, sort, brand_id } = state ?? { search: '', sort: '', brand_id: '' };
    const [search, setSearch] = useState(currentSearch || '');
    const [brandFilter, setBrandFilter] = useState(brand_id || '');

    const handleSearch = useCallback(
        debounce((value: string, currentSort: any, currentBrandId: string) => {
            router.get(
                route('laptops.index'),
                {
                    search: value,
                    sort: currentSort,
                    brand_id: currentBrandId || undefined,
                },
                { preserveState: true, replace: true }
            );
        }, 300),
        []
    );

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        handleSearch(value, sort, brandFilter);
    };

    const onBrandChange = (value: string) => {
        const nextBrandId = value === 'all' ? '' : value;
        setBrandFilter(nextBrandId);
        router.get(
            route('laptops.index'),
            {
                search: search,
                sort: sort,
                brand_id: nextBrandId || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    return (
        <>
            <Head title={t('laptops.title', { defaultValue: 'Laptops' })} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="text-start w-full">
                                <CardTitle>{t('laptops.title', { defaultValue: 'Laptops' })}</CardTitle>
                                <CardDescription>{t('laptops.description', { defaultValue: 'Manage laptop inventory and specifications' })}</CardDescription>
                            </div>
                            <div className="flex flex-col-reverse md:flex-row gap-4 w-full justify-end">
                                <div className="relative w-full md:w-64">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                        <LucideSearch className="size-4" />
                                    </div>
                                    <Input
                                        placeholder={t('laptops.search_placeholder', { defaultValue: 'Search laptops...' })}
                                        className="pl-9"
                                        value={search}
                                        onChange={onSearchChange}
                                    />
                                </div>
                                <div className="w-full md:w-56">
                                    <FieldSelect
                                        name="brand_filter"
                                        value={brandFilter || 'all'}
                                        onValueChange={(value) => onBrandChange(value as string)}
                                        options={[
                                            { value: 'all', label: t('laptops.all_brands', { defaultValue: 'All brands' }) },
                                            ...brands.map((brand) => ({ value: String(brand.id), label: brand.name })),
                                        ]}
                                    />
                                </div>
                                <Link
                                    as="button"
                                    href={route('laptops.create')}
                                    className={cn(buttonVariants({ variant: 'primary' }), 'w-fit text-nowrap self-end md:self-auto')}
                                >
                                    <LucideCirclePlus />
                                    {t('laptops.create', { defaultValue: 'Create Laptop' })}
                                </Link>
                            </div>
                        </CardHeader>
                        <CardBody className="px-0">
                            <div className="hidden md:block">
                                <LaptopDesktopTable laptops={laptops.data} state={state} />
                            </div>

                            <div className="block md:hidden">
                                <LaptopMobileList laptops={laptops.data} />
                            </div>
                        </CardBody>
                        <CardFooter className="flex justify-center">
                            <PaginationLinks paginator={laptops} />
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
        <AuthenticatedLayout header={<Heading size="sm">{t('laptops.title', { defaultValue: 'Laptops' })}</Heading>}>
            {children}
        </AuthenticatedLayout>
    );
};

LaptopIndexPage.layout = (page: any) => <IndexLayout>{page}</IndexLayout>;
