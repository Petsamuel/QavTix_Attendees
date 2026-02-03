"use client"

import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { Icon } from "@iconify/react"
import Image from "next/image"
import { Badge } from "../ui/badge"

interface AnalyticsMetricStatCardProps {
    label: string
    value: string | number
    trend?: {
        value: string
        isUp: boolean
    }
    iconPath: string
    className?: string
}

export default function AnalyticsMetricStatCard2({
    label,
    value,
    trend,
    iconPath,
    className
}: AnalyticsMetricStatCardProps) {
    return (
        <div className={cn(
            "bg-white p-5 rounded-2xl h-23 justify-center border border-brand-neutral-3 shadow-[0px_5.8px_23.17px_0px_#3326AE14] flex flex-col gap-3",
            className
        )}>
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center overflow-hidden">
                    <Image width={50} height={50} src={iconPath} alt={label} className="size-6 object-contain select-none pointer-events-none" />
                </div>
                <span className="text-brand-secondary-7 text-xs">
                    {label}
                </span>
            </div>

            <div className="flex items-center justify-between">
                <span className={cn(
                    "md:text-xl font-bold text-brand-secondary-9",
                    space_grotesk.className
                )}>
                    {value}
                </span>

                {trend && (
                    <Badge className={cn(
                        "flex items-center border-[0.86px] gap-1 px-2 py-1 rounded-sm text-xs font-medium",
                        trend.isUp 
                            ? "bg-[#94C8001A] border-[#94C80033] text-[#94C800]" 
                            : "bg-[#F326481A] text-[#F32648] border-[#F3264833]"
                    )}>
                        {trend.value}
                        <Icon 
                            icon={trend.isUp ? "solar:arrow-right-up-linear" : "solar:arrow-right-down-linear"} 
                            className="size-3"
                        />
                    </Badge>
                )}
            </div>
        </div>
    )
}