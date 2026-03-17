import { AffiliateMetricId, MetricConfig } from "@/components/cards/resources/metrics-config"
import { Currency } from "@/lib/redux/slices/settingsSlice"

export function buildMetricsFromConfig(
    config:   Record<string, MetricConfig>,
    apiData:  Record<string, any>,
    currency: Currency,
) {
    return Object.keys(config).map(key => {
        const metricConfig = config[key]
        const value        = apiData[key]

        return {
            ...metricConfig,
            value: metricConfig.valueFormatter
                ? metricConfig.valueFormatter(value, currency)
                : value
        }
    })
}

// Maps metric id → value + changePct from AffiliatePerformanceData
export function buildAffiliateMetricStats(
    data: AffiliatePerformanceData | null,
): Record<AffiliateMetricId, { value: number; changePct: number }> {
    return {
        clicks:   { value: data?.total_clicks    ?? 0, changePct: data?.total_clicks_change_pct    ?? 0 },
        sales:    { value: data?.total_sales      ?? 0, changePct: data?.total_sales_change_pct      ?? 0 },
        rate:     { value: data?.conversion_rate  ?? 0, changePct: data?.conversion_rate_change_pct  ?? 0 },
        earnings: { value: data?.total_earnings   ?? 0, changePct: data?.total_earnings_change_pct   ?? 0 },
    }
}