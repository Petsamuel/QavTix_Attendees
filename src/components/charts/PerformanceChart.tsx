"use client"

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, Tooltip,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { formatYTick, getNiceTicks } from "@/helper-fns/chartFormatters"
import { useEffect } from "react"

interface ChartDataPoint {
    label:        string
    value:        number
    displayLabel: string
}

type TimeFilter = "week" | "month" | "year"

const MONTH_LABELS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
const DAY_NAMES    = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

const getDayName = (dayNumber: number): string => {
    const now  = new Date()
    const date = new Date(now.getFullYear(), now.getMonth(), dayNumber)
    return DAY_NAMES[date.getDay()]
}

const normaliseData = (data: AffiliatePerformanceData | null, filter: TimeFilter): ChartDataPoint[] => {
    if (!data?.earnings_graph?.length) return []

    if (filter === "year") {
        return (data.earnings_graph as YearEarningPoint[]).map(p => {
            const label = MONTH_LABELS[(p.month - 1)] ?? `M${p.month}`
            return { label, value: p.earning, displayLabel: label }
        })
    }

    if (filter === "month") {
        return (data.earnings_graph as MonthEarningPoint[]).map(p => {
            const label = `Wk ${p.week}`
            return { label, value: p.earning, displayLabel: `Week ${p.week}` }
        })
    }

    if (filter === "week") {
        return (data.earnings_graph as WeekEarningPoint[]).map(p => {
            const dayName = getDayName(p.day)
            return { label: dayName, value: p.earning, displayLabel: `${dayName} (${p.day})` }
        })
    }

    return []
}

interface PerformanceChartProps {
    allData:        AllPerformanceData
    activeFilter:   TimeFilter
    selectedYear:   string
    availableYears: string[]
    onFilterChange: (filter: TimeFilter) => void
    onYearChange:   (year: string) => void
    isLoading?:     boolean
}

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const point = payload[0].payload as ChartDataPoint
    return (
        <div className="bg-white px-3 py-2 text-xs border border-brand-neutral-3 rounded-lg shadow-sm">
            <p className="font-medium text-brand-neutral-8">{point.displayLabel}</p>
            <p className="text-brand-accent-6 font-semibold">₦{(payload[0].value ?? 0).toLocaleString()}</p>
        </div>
    )
}

export default function PerformanceChart({
    allData,
    activeFilter,
    selectedYear,
    availableYears,
    onFilterChange,
    onYearChange,
    isLoading = false,
}: PerformanceChartProps) {

    const chartData = normaliseData(allData[activeFilter], activeFilter)
    const maxValue  = Math.max(...chartData.map(d => d.value), 0)
    const { ticks, yMax } = getNiceTicks(maxValue)
    const currentYear = new Date().getFullYear()

    useEffect(() => {
        if (selectedYear === String(currentYear)) {
            onFilterChange("year")
        }
    }, [selectedYear])

    return (
        <div className={cn("w-full border border-brand-neutral-2 p-2 flex-1 transition-opacity duration-200", isLoading && "opacity-50 pointer-events-none")}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-b-neutral-5 pb-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-xs text-brand-secondary-5">Activity</h2>
                    <Select value={selectedYear} onValueChange={onYearChange}>
                        <SelectTrigger className="w-20 text-xs h-9 border-brand-neutral-3 font-medium text-brand-secondary-9 rounded-lg">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map(y => (
                                <SelectItem key={y} value={y} className="text-xs">{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 bg-brand-neutral-3 rounded-xl p-2">
                    {(["year", "month", "week"] as const).map(f => (
                        <button
                            key={f}
                            disabled={selectedYear !== String(currentYear)}
                            onClick={() => onFilterChange(f)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs disabled:cursor-not-allowed disabled:opacity-70 font-medium transition-all capitalize",
                                activeFilter === f
                                    ? "bg-brand-primary-6 text-white shadow-sm"
                                    : "text-brand-neutral-7 hover:text-brand-neutral-9"
                            )}
                        >
                            {f === "year" ? "Annual" : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <div className="min-w-150 h-90">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            key={`${activeFilter}-${selectedYear}`}
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
                                tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }}
                                tickMargin={12}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                                tickFormatter={formatYTick}
                                domain={[0, yMax]}
                                ticks={ticks}
                                tickMargin={8}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
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
                                background={{ fill: "#E5E7EB", radius: "20px" }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}