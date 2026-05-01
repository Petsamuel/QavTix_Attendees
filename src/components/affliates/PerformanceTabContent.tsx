"use client"

import { useState, useTransition } from "react"
import AnalyticsMetricStatCard2 from "../cards/AnalyticsMetricsStatCard2"
import PerformanceChart from "../charts/PerformanceChart"
import {
    AFFILIATE_METRICS_CONFIG,
} from "../cards/resources/metrics-config"
import { getAffiliatePerformanceAll } from "@/actions/affiliates/client"
import { useAppSelector } from "@/lib/redux/hooks"
import { buildAffiliateMetricStats } from "@/helper-fns/buildMetricsConfig"
import ChartLoader from "../loaders/ChartLoader"
import { PLATFORM_CURRENCY } from "@/components-data/currencies"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"

type TimeFilter = "week" | "month" | "year"

const CURRENT_YEAR = new Date().getFullYear()
const AVAILABLE_YEARS = [CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR].map(String)

interface Props {
    initialData: AllPerformanceData
}

export default function PerformanceTabContent({ initialData }: Props) {

    const { user }    = useAppSelector(store => store.authUser)
    const [allData,       setAllData]       = useState<AllPerformanceData>(initialData)
    const [activeFilter,  setActiveFilter]  = useState<TimeFilter>("year")
    const [selectedYear,  setSelectedYear]  = useState(String(CURRENT_YEAR))
    const [isPending,     startTransition]  = useTransition()
    const isMounted = useIsMounted()

    const currency = isMounted
        ? (user?.currency || PLATFORM_CURRENCY)
        : PLATFORM_CURRENCY

    // Active data for stat cards — always the currently visible filter
    const activeData = allData[activeFilter]

    const metricStats = buildAffiliateMetricStats(activeData)

    // When year changes — re-fetch all three filters for the new year
    const handleYearChange = (year: string) => {
        setSelectedYear(year)
        startTransition(async () => {
            const fresh = await getAffiliatePerformanceAll(parseInt(year))
            setAllData(fresh)
        })
    }

    // Filter change is instant — data already fetched for this year
    const handleFilterChange = (filter: TimeFilter) => {
        setActiveFilter(filter)
    }

    if (!allData.year && !allData.month && !allData.week) {
        return <ChartLoader />
    }

    return (
        <div className="flex flex-col lg:flex-row gap-5 py-3">
            <PerformanceChart
                allData={allData}
                activeFilter={activeFilter}
                selectedYear={selectedYear}
                availableYears={AVAILABLE_YEARS}
                onFilterChange={handleFilterChange}
                onYearChange={handleYearChange}
                isLoading={isPending}
            />

            <div className="max-w-sm w-full mx-auto lg:mx-0 lg:w-[24em] flex flex-col gap-3">
                {AFFILIATE_METRICS_CONFIG.map(metric => {
                    const stats = metricStats[metric.id as keyof typeof metricStats]
                    return (
                        <AnalyticsMetricStatCard2
                            key={metric.id}
                            label={metric.label}
                            iconPath={metric.iconPath}
                            value={metric.valueFormatter(stats.value, currency)}
                            trend={{
                                value: `$${Math.abs(stats.changePct).toFixed(1)}%`,
                                isUp:  stats.changePct >= 0,
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}