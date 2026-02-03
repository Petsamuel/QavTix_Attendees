"use client"

import { cn } from "@/lib/utils"
import { howItWorksCardsConfig2VariantStyles, HowItWorksCardConfig } from "./resources/metrics-config"
import { Icon } from "@iconify/react"

interface HowItWorksCardProps {
    config: HowItWorksCardConfig
}

export default function HowItWorksCard({ config }: HowItWorksCardProps) {
    const styles = howItWorksCardsConfig2VariantStyles[config.variant]
    
    return (
        <div className={cn(
            "flex items-center gap-3 w-full min-w-40 max-h-24 px-4 py-4 rounded-xl border-[1.5px] transition-all duration-200 hover:shadow-md",
            styles.container
        )}>
            <div className={cn(
                "flex items-center justify-center size-10 rounded-lg shrink-0",
                styles.iconBg, styles.iconText
            )}>
                <Icon 
                    icon={styles.icon}
                    width="20"
                    height="20" 
                    className={cn("size-6")} 
                />
            </div>

            <div className="flex flex-col justify-center">
                <div className="flex flex-col -mt-0.5">
                    <span className={cn("text-xs font-bold whitespace-nowrap", styles.label)}>
                        {config.label}
                    </span>
                    <span className={cn("text-[10px] leading-tight line-clamp-2 max-w-30", styles.description)}>
                        {config.description}
                    </span>
                </div>
            </div>
        </div>
    )
}