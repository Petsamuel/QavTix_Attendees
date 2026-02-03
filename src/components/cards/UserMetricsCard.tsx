import { calculateTrend } from "@/helper-fns/calculateTrend";
import { cn } from "@/lib/utils";
import MetricSparkline from "../charts/MetricsSparkLine";
import { space_grotesk } from "@/lib/fonts";

interface UserMetricCardProps {
    label: string;
    value: string | number;
    trendData: number[];
    className?: string;
    isNegativeGood?: boolean;
}

export default function UserMetricCard({ 
    label, 
    value, 
    trendData,
    className,
    isNegativeGood = false
}: UserMetricCardProps) {
    
    const trend = calculateTrend(trendData)
    
    // Adjust color logic if negative trend is good (e.g., refund count)
    const displayColor = isNegativeGood 
        ? trend.direction === 'down' ? '#10B981' : trend.direction === 'up' ? '#EF4444' : trend.color
        : trend.color;
    
    const displayDirection = isNegativeGood && trend.direction !== 'stable'
        ? trend.direction === 'down' ? 'up' : 'down'
        : trend.direction;
    
    const showPercentage = trend.direction !== 'stable';
    
    return (
        <div className={cn(
            'bg-white rounded-2xl border h-27 flex flex-col gap-2 justify-center items-center border-brand-neutral-2 p-3 md:py-4 md:px-6 shadow-[0px_5.8px_23.17px_0px_#3326AE14] transition-transform hover:scale-103 ease-linear',
            className
        )}>
            <div className="flex justify-between w-full items-center gap-3">
                <p className="text-xs text-brand-secondary-9">
                    {label}
                </p>
                {showPercentage && (
                    <span 
                        className="text-xs md:text-sm font-bold"
                        style={{ color: displayColor }}
                    >
                        {displayDirection === 'up' ? '+' : displayDirection === 'down' ? '-' : ''}
                        {trend.percentageChange.toFixed(0)}%
                    </span>
                )}
            </div>
            <div className="flex w-full justify-between items-center gap-3">
                <h3 className={cn(space_grotesk.className, "md:text-xl font-bold text-brand-secondary-9 mb-2")}>
                    {value}
                </h3>
                <div>
                    <MetricSparkline 
                        data={trendData}
                        color={displayColor}
                        width={80}
                        height={40}
                    />
                </div>
            </div>
        </div>
    )
}