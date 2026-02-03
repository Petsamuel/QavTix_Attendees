import { MetricConfig } from "@/components/cards/resources/metrics-config"

export function buildMetricsFromConfig(
    config: Record<string, MetricConfig>,
    apiData: Record<string, any>
) {
    return Object.keys(config).map(key => {
        const metricConfig = config[key]
        const value = apiData[key]
        
        return {
            ...metricConfig,
            value: metricConfig.valueFormatter 
                ? metricConfig.valueFormatter(value)
                : value
        }
    })
}