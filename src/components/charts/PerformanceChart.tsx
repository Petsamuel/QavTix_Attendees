"use client"

import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ChartDataPoint {
    label: string;
    value: number;
    displayLabel: string;
}

type TimeFilter = 'week' | 'month' | 'annual';

const generateMockData = (filter: TimeFilter, year: number): ChartDataPoint[] => {
    switch (filter) {
        case 'week':
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
                label: day,
                value: Math.floor(Math.random() * 3000) + 500,
                displayLabel: day
            }))
        case 'month':
            return ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week) => ({
                label: week,
                value: Math.floor(Math.random() * 4000) + 1000,
                displayLabel: week
            }))
        case 'annual':
            return ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month) => ({
                label: month,
                value: Math.floor(Math.random() * 3000) + 500,
                displayLabel: month
            }))
        default:
            return [];
    }
}

export default function PerformanceChart() {

    const [timeFilter, setTimeFilter] = useState<TimeFilter>('annual')
    const [selectedYear, setSelectedYear] = useState('2025')
    const [chartData, setChartData] = useState<ChartDataPoint[]>([])

    const years = ['2023', '2024', '2025', '2026']

    useEffect(() => {
        const data = generateMockData(timeFilter, parseInt(selectedYear))
        setChartData(data)
    }, [timeFilter, selectedYear])

    const customTooltip = (props: any) => {
        const { active, payload } = props;
        if (active && payload && payload.length > 0) {
            const data = payload[0].payload as ChartDataPoint;
            return (
                <div className="bg-white px-3 py-2 text-xs border border-brand-neutral-3 rounded-lg shadow-sm">
                    <p className="font-medium text-brand-neutral-8">
                        {data.displayLabel}
                    </p>
                    <p className="text-brand-accent-6 font-semibold">
                        ${(payload[0].value ?? 0).toLocaleString()}
                    </p>
                </div>
            )
        }
        return null;
    }

    return (
        <div className="w-full border border-brand-neutral-2 p-2">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-b-neutral-5 pb-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-xs text-brand-secondary-5">
                        Activity
                    </h2>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-20 text-xs h-9 border-brand-neutral-3 font-medium text-brand-secondary-9 rounded-lg">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year} className='text-xs'>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>


                <div className="flex items-center gap-2 bg-brand-neutral-3 rounded-xl p-2">
                    <button
                        onClick={() => setTimeFilter('annual')}
                        className={cn(
                            'px-4 py-2 rounded-lg text-xs font-medium transition-all',
                            timeFilter === 'annual'
                                ? 'bg-brand-primary-8 text-white shadow-sm'
                                : 'text-brand-neutral-7 hover:text-brand-neutral-9'
                        )}
                    >
                        Annual
                    </button>
                    <button
                        onClick={() => setTimeFilter('month')}
                        className={cn(
                            'px-4 py-2 rounded-lg text-xs font-medium transition-all',
                            timeFilter === 'month'
                                ? 'bg-brand-primary-6 text-white shadow-sm'
                                : 'text-brand-neutral-7 hover:text-brand-neutral-9'
                        )}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => setTimeFilter('week')}
                        className={cn(
                            'px-4 py-2 rounded-lg text-xs font-medium transition-all',
                            timeFilter === 'week'
                                ? 'bg-brand-primary-6 text-white shadow-sm'
                                : 'text-brand-neutral-7 hover:text-brand-neutral-9'
                        )}
                    >
                        Week
                    </button>
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <div className="min-w-150 h-90">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            key={timeFilter}
                            data={chartData}
                            margin={{ top: 10, bottom: 30 }}
                            barCategoryGap="45%"
                        >
                            <CartesianGrid
                                strokeDasharray="4px"
                                vertical={false}
                                stroke="#d4d9e0"
                                strokeWidth={0.5}
                            />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                                tickMargin={12}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                tickFormatter={(value) => (value === 0 ? '0' : `${value / 1000}k`)}
                                domain={[0, 6000]}
                                ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000]}
                                tickMargin={8}
                            />
                            <Tooltip content={customTooltip} cursor={{ fill: 'transparent' }} />
                            
                            <Bar
                                dataKey="value"
                                fill="#2E71D5"
                                radius={[5, 5, 2, 2]}
                                maxBarSize={10}
                                barSize={9}
                                isAnimationActive={true}
                                animationBegin={0}
                                animationDuration={500}
                                animationEasing="ease-in-out"
                                background={{ fill: '#E5E7EB', radius: "20px" }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}