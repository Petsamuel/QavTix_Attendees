import { cn } from "@/lib/utils"
import MetricCard from "./MetricCard1"

interface MetricsCardsConatinerProps {
    metrics: MetricCardData[]
    className?: string
}

export default function MetricCardsContainer1({ metrics, className }: MetricsCardsConatinerProps) {
    return (
        <div className={cn(
            'grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-4 gap-4',
            className
        )}>
            {metrics.map((metric) => (
                <MetricCard key={metric.id} data={metric} />
            ))}
        </div>
    )
}