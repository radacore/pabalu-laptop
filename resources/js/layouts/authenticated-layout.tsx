import ApplicationLogo from '@/components/application-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from '@/components/ui/menu';
import { 
    Sidebar, 
    SidebarContent, 
    SidebarFooter, 
    SidebarGroup, 
    SidebarGroupTitle, 
    SidebarHeader, 
    SidebarItem, 
    SidebarItemButton, 
    SidebarList, 
    SidebarLogo, 
    SidebarMenu 
} from '@/components/ui/sidebar';
import { getInitials } from '@/utils/initials';
import { Link, usePage } from '@inertiajs/react';
import { 
    LucideChevronsUpDown,
    LucideClock,
    LucideCircleDot,
    LucideHouse, 
    LucideKey,
    LucideLaptop,
    LucideLayoutDashboard,
    LucideLogOut, 
    LucidePanelLeftClose,
    LucidePanelLeftOpen,
    LucideShield,
    LucideUserCog,
    LucideUserRound,
    LucideUsers,
    LucideWrench,
    LucideWallet,
    LucideX
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import { FlashMessages } from '@/components/flash-messages';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;
    const isCustomer = user.roles?.some((role) => {
        const roleName = typeof role === 'string' ? role : (role as unknown as { name?: string }).name;

        return roleName === 'Customer';
    }) ?? false;
    const trackingIndexHref = route().has('tracking.index') ? route('tracking.index') : '#';
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const windowResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        windowResize();
        window.addEventListener('resize', windowResize);
        return () => window.removeEventListener('resize', windowResize);
    }, []);

    function handleSidebarToggle() {
        setSidebarOpen(!sidebarOpen);
    }

    return (
        <>
            <FlashMessages />
            
            {/* Mobile Sidebar Backdrop */}
            <div
                className={cn(
                    'fixed inset-0 bg-black backdrop-blur-sm z-30 transition-all max-lg:block hidden',
                    sidebarOpen ? 'opacity-40 visible' : 'opacity-0 invisible',
                )}
                onClick={handleSidebarToggle}
            />

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed top-0 z-40 w-full max-w-72 md:w-72 h-dvh transition-all',
                    sidebarOpen ? 'left-0' : '-left-full',
                )}
            >
                <Sidebar
                    size="loose"
                    className="h-full bg-card border-r border-border flex flex-col"
                >
                    <SidebarHeader>
                        <div className="flex items-center justify-between">
                            <SidebarLogo>
                                <a href={route('welcome')} className="flex items-center gap-2">
                                    <ApplicationLogo className="h-8 w-8 fill-current text-foreground" />
                                    <span className="font-semibold">Selia</span>
                                </a>
                            </SidebarLogo>
                            <Button
                                variant="plain"
                                size="sm-icon"
                                className="lg:hidden"
                                onClick={handleSidebarToggle}
                            >
                                <LucideX className="size-5" />
                            </Button>
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="flex-1">
                        <SidebarMenu>
                            {isCustomer ? (
                                <SidebarGroup>
                                    <SidebarGroupTitle>{t('customer_dashboard.my_services')}</SidebarGroupTitle>
                                    <SidebarList>
                                        <SidebarItem>
                                            <SidebarItemButton
                                                active={route().current('customer.dashboard')}
                                                render={
                                                    <Link
                                                        href={route('customer.dashboard')}
                                                        onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                    />
                                                }
                                            >
                                                <LucideLayoutDashboard />
                                                {t('navigation.customer_dashboard')}
                                            </SidebarItemButton>
                                        </SidebarItem>

                                        <SidebarItem>
                                            <SidebarItemButton
                                                active={route().current('profile.*')}
                                                render={
                                                    <Link
                                                        href={route('profile.edit')}
                                                        onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                    />
                                                }
                                            >
                                                <LucideUserCog />
                                                {t('navigation.profile')}
                                            </SidebarItemButton>
                                        </SidebarItem>

                                        <SidebarItem>
                                            <SidebarItemButton
                                                active={route().has('tracking.index') && route().current('tracking.*')}
                                                render={
                                                    <Link
                                                        href={trackingIndexHref}
                                                        onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                    />
                                                }
                                            >
                                                <LucideClock />
                                                {t('navigation.track_service')}
                                            </SidebarItemButton>
                                        </SidebarItem>
                                    </SidebarList>
                                </SidebarGroup>
                            ) : (
                                <>
                            <SidebarGroup>
                                <SidebarGroupTitle>Navigation</SidebarGroupTitle>
                                <SidebarList>
                                    <SidebarItem>
                                        <SidebarItemButton
                                            active={route().current('dashboard')}
                                            render={
                                                <Link
                                                    href={route('dashboard')}
                                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                />
                                            }
                                        >
                                            <LucideLayoutDashboard />
                                            {t('navigation.dashboard')}
                                        </SidebarItemButton>
                                    </SidebarItem>

                                    <SidebarItem>
                                        <SidebarItemButton
                                            active={route().current('users.*')}
                                            render={
                                                <Link
                                                    href={route('users.index')}
                                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                />
                                            }
                                        >
                                            <LucideUsers />
                                            {t('navigation.users')}
                                        </SidebarItemButton>
                                    </SidebarItem>

                                    <SidebarItem>
                                        <SidebarItemButton
                                            active={route().current('roles.*')}
                                            render={
                                                <Link
                                                    href={route('roles.index')}
                                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                />
                                            }
                                        >
                                            <LucideShield />
                                            {t('navigation.roles')}
                                        </SidebarItemButton>
                                    </SidebarItem>

                                    <SidebarItem>
                                        <SidebarItemButton
                                            active={route().current('permissions.*')}
                                            render={
                                                <Link
                                                    href={route('permissions.index')}
                                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                />
                                            }
                                        >
                                            <LucideKey />
                                            {t('navigation.permissions')}
                                        </SidebarItemButton>
                                    </SidebarItem>

                                    <SidebarItem>
                                        <SidebarItemButton
                                            active={route().current('customers.*')}
                                            render={
                                                <Link
                                                    href={route('customers.index')}
                                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                />
                                            }
                                        >
                                            <LucideUserRound />
                                            {t('navigation.customers')}
                                        </SidebarItemButton>
                                    </SidebarItem>

                                    <SidebarItem>
                                        <SidebarItemButton
                                            active={route().current('profile.*')}
                                            render={
                                                <Link
                                                    href={route('profile.edit')}
                                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                />
                                            }
                                        >
                                            <LucideUserCog />
                                            {t('navigation.profile')}
                                        </SidebarItemButton>
                                    </SidebarItem>
                                </SidebarList>
                            </SidebarGroup>

                            <SidebarGroup>
                                <SidebarGroupTitle>Inventory</SidebarGroupTitle>
                                <SidebarList>
                                    <SidebarItem>
                                        <SidebarItemButton
                                            active={route().current('brands.*')}
                                            render={
                                                <Link
                                                    href={route('brands.index')}
                                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                />
                                            }
                                        >
                                            <LucideCircleDot />
                                            {t('navigation.brands')}
                                        </SidebarItemButton>
                                    </SidebarItem>

                                    <SidebarItem>
                                        <SidebarItemButton
                                            active={route().current('laptop-sources.*')}
                                            render={
                                                <Link
                                                    href={route('laptop-sources.index')}
                                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                />
                                            }
                                        >
                                            <LucideCircleDot />
                                            {t('navigation.laptop_sources')}
                                        </SidebarItemButton>
                                    </SidebarItem>

                                    <SidebarItem>
                                        <SidebarItemButton
                                            active={route().current('laptops.*')}
                                            render={
                                                <Link
                                                    href={route('laptops.index')}
                                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                />
                                            }
                                        >
                                            <LucideLaptop />
                                            {t('navigation.laptops')}
                                        </SidebarItemButton>
                                    </SidebarItem>
                                </SidebarList>
                            </SidebarGroup>

                            <SidebarGroup>
                                <SidebarGroupTitle>Services</SidebarGroupTitle>
                                <SidebarList>
                                    <SidebarItem>
                                        <SidebarItemButton
                                            active={route().current('service-categories.*')}
                                            render={
                                                <Link
                                                    href={route('service-categories.index')}
                                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                />
                                            }
                                        >
                                            <LucideCircleDot />
                                            {t('navigation.service_categories')}
                                        </SidebarItemButton>
                                    </SidebarItem>

                                    <SidebarItem>
                                        <SidebarItemButton
                                            active={route().current('services.*')}
                                            render={
                                                <Link
                                                    href={route('services.index')}
                                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                />
                                            }
                                        >
                                            <LucideWrench />
                                            {t('navigation.services')}
                                        </SidebarItemButton>
                                    </SidebarItem>
                                </SidebarList>
                            </SidebarGroup>

                            <SidebarGroup>
                                <SidebarGroupTitle>Finance</SidebarGroupTitle>
                                <SidebarList>
                                    <SidebarItem>
                                        <SidebarItemButton
                                            active={route().current('transactions.*')}
                                            render={
                                                <Link
                                                    href={route('transactions.index')}
                                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                                />
                                            }
                                        >
                                            <LucideWallet />
                                            {t('navigation.transactions')}
                                        </SidebarItemButton>
                                    </SidebarItem>

                                </SidebarList>
                            </SidebarGroup>
                                </>
                            )}
                        </SidebarMenu>
                    </SidebarContent>

                    <SidebarFooter className="shrink-0">
                        <SidebarMenu>
                            <SidebarList>
                                <SidebarItem>
                                    <Menu>
                                        <MenuTrigger
                                            data-slot="sidebar-item-button"
                                            nativeButton={false}
                                            render={
                                                <SidebarItemButton 
                                                    className="border border-border"
                                                >
                                                    <Avatar size="sm">
                                                        <AvatarImage src="https://www.gravatar.com/avatar/c22d38582ca23fa7ccfddb87b5334b03?s=200&d=mp" />
                                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <span className="font-medium truncate">{user.name}</span>
                                                        <span className="text-sm text-muted truncate">{user.email}</span>
                                                    </div>
                                                    <LucideChevronsUpDown className="ml-auto shrink-0" />
                                                </SidebarItemButton>
                                            }
                                        />
                                        <MenuPopup className="w-(--anchor-width)" side="top">
                                            <MenuItem render={
                                                <Button
                                                    nativeButton={false}
                                                    variant="plain"
                                                    render={
                                                        <Link
                                                            className='justify-start'
                                                            href={route('welcome')}
                                                            rel="noopener noreferrer"
                                                        />
                                                    }>
                                                    <LucideHouse/>
                                                    {t('navigation.home')}
                                                </Button>
                                            }/>
                                            <MenuItem render={
                                                <Button
                                                    nativeButton={false}
                                                    variant="plain"
                                                    render={
                                                        <Link
                                                            className='justify-start'
                                                            href={route('profile.edit')}
                                                        />
                                                    }>
                                                    <LucideUserRound />
                                                    {t('navigation.profile')}
                                                </Button>
                                            }/>
                                            <MenuSeparator />
                                            <MenuItem render={
                                                <Button
                                                    nativeButton
                                                    variant="plain"
                                                    render={
                                                        <Link
                                                            className='justify-start w-full'
                                                            href={route('logout')}
                                                            method="post"
                                                            as="button"
                                                        />
                                                    }>
                                                    <LucideLogOut/>
                                                    {t('common.logout')}
                                                </Button>
                                            }/>
                                        </MenuPopup>
                                    </Menu>
                                </SidebarItem>
                            </SidebarList>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
            </div>

            {/* Main Content */}
            <main className={cn('transition-all lg:ml-72', !sidebarOpen && 'lg:ml-0')}>
                {/* Top Navigation Bar */}
                <nav className={cn(
                    'h-16 flex items-center gap-2.5 border-b border-border bg-card px-2 max-lg:px-4',
                    sidebarOpen ? 'xl:pr-4' : 'xl:px-4',
                )}>
                    <Button
                        variant="plain"
                        size="sm-icon"
                        onClick={handleSidebarToggle}
                    >
                        {sidebarOpen ? <LucidePanelLeftClose className="size-5" /> : <LucidePanelLeftOpen className="size-5" />}
                    </Button>
                    {header && (
                        <>{header}</>
                    )}
                    <div className="ml-auto flex items-center gap-1">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>
                </nav>

                {/* Page Content */}
                <div className="min-h-[calc(100vh-4rem)] flex flex-col">  
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
}
