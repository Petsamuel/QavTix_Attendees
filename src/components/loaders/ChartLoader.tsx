"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function ChartLoader() {
    return (
        <div className="w-full border border-brand-neutral-2 p-2 animate-pulse">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-b-neutral-5 pb-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-12 rounded" />
                    <Skeleton className="h-9 w-20 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-52 rounded-xl" />
            </div>

            {/* Chart area — mirrors min-w-150 h-90 */}
            <div className="w-full overflow-x-auto">
                <div className="min-w-150 h-90 gap-2 flex flex-col justify-between">
                    {/* Y-axis grid lines */}
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-3 w-6 rounded shrink-0" />
                            <div className="flex-1 h-px bg-brand-neutral-3" />
                        </div>
                    ))}

                    {/* Bars row */}
                    <div className="flex items-end justify-around px-6 mt-2 gap-1">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                <Skeleton
                                    className="w-2.5 rounded-t-sm"
                                    style={{ height: `${Math.random() * 60 + 20}px` }}
                                />
                                <Skeleton className="h-3 w-6 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}