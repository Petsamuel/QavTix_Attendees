import AnalyticsMetricStatCard2 from "../cards/AnalyticsMetricsStatCard2";
import { AFFILIATE_METRICS_CONFIG, mockAffiliateStats } from "../cards/resources/metrics-config";
import PerformanceChart from "../charts/PerformanceChart";

export default function PerformanceTabContent(){
    return (
        <div className="flex flex-col lg:flex-row gap-5 py-3">
            <PerformanceChart />

            <div className="max-w-sm w-full mx-auto lg:mx-0 lg:w-[24em] flex flex-col gap-3">
                {AFFILIATE_METRICS_CONFIG.map((metric) => {
                    const stats = mockAffiliateStats[metric.id as keyof typeof mockAffiliateStats]
                    
                    return (
                        <AnalyticsMetricStatCard2
                            key={metric.id}
                            label={metric.label}
                            iconPath={metric.iconPath}
                            value={stats.value}
                            trend={{
                                value: stats.trend,
                                isUp: stats.isUp
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}