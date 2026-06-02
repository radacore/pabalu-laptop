import { Card, CardBody, CardHeader, CardHeaderAction, CardTitle } from '@/components/ui/card';
import { Select, SelectPopup, SelectItem, SelectList, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/utils/cn';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
    name: string;
    income: number;
    expense: number;
}

interface ChartProps {
    data: ChartDataPoint[];
}

type Period = '3' | '6' | '12';

export function Chart({ data }: ChartProps) {
    const { t } = useTranslation();
    const [period, setPeriod] = useState<Period>('12');

    const filteredData = useMemo(() => {
        const count = parseInt(period);
        return data.slice(-count);
    }, [data, period]);

    const formatValue = (value: number) => {
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
        if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
        return String(value);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('dashboard.income_chart', { defaultValue: 'Pendapatan' })}</CardTitle>
                <CardHeaderAction>
                    <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
                        <SelectTrigger className="h-8 w-32 text-xs">
                            <SelectValue options={[
                                { value: '3', label: t('dashboard.chart_3m', { defaultValue: '3 Bulan' }) },
                                { value: '6', label: t('dashboard.chart_6m', { defaultValue: '6 Bulan' }) },
                                { value: '12', label: t('dashboard.chart_12m', { defaultValue: '12 Bulan' }) },
                            ]} />
                        </SelectTrigger>
                        <SelectPopup>
                            <SelectList>
                                <SelectItem value="3">{t('dashboard.chart_3m', { defaultValue: '3 Bulan' })}</SelectItem>
                                <SelectItem value="6">{t('dashboard.chart_6m', { defaultValue: '6 Bulan' })}</SelectItem>
                                <SelectItem value="12">{t('dashboard.chart_12m', { defaultValue: '12 Bulan' })}</SelectItem>
                            </SelectList>
                        </SelectPopup>
                    </Select>
                </CardHeaderAction>
            </CardHeader>
            <CardBody>
                <div
                    className={cn(
                        'w-full h-[200px] md:h-[320px] [&_*]:outline-none',
                        '[&_.recharts-cartesian-axis-tick-value]:text-sm [&_.recharts-cartesian-axis-tick-value]:fill-dimmed',
                    )}
                >
                    <ResponsiveContainer>
                        <AreaChart
                            data={filteredData}
                            margin={{ top: 8, right: 0, left: 20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} stroke="var(--color-separator)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} width={40} tickLine={false} tickFormatter={formatValue} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 'var(--radius)',
                                    boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
                                    background: 'var(--color-popover)',
                                    border: 'none',
                                }}
                                itemStyle={{
                                    color: 'var(--color-muted)',
                                    fontSize: 'var(--text-sm)',
                                    display: 'flex',
                                }}
                                labelStyle={{
                                    color: 'var(--color-foreground)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 600,
                                    marginBottom: 4,
                                }}
                                cursor={false}
                                formatter={(value) => formatValue(Number(value))}
                            />
                            <Area
                                type="monotone"
                                dataKey="income"
                                name={t('dashboard.income', { defaultValue: 'Pemasukan' })}
                                stroke="#22c55e"
                                fillOpacity={1}
                                fill="url(#incomeGradient)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="expense"
                                name={t('dashboard.expense', { defaultValue: 'Pengeluaran' })}
                                stroke="#ef4444"
                                fillOpacity={1}
                                fill="url(#expenseGradient)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardBody>
        </Card>
    );
}
