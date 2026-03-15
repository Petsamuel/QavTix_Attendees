import { MetricConfig } from "@/components/cards/resources/metrics-config"
import { Currency } from "@/lib/redux/slices/settingsSlice"

export function buildMetricsFromConfig(
    config:   Record<string, MetricConfig>,
    apiData:  Record<string, any>,
    currency: Currency
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