"use client"

import EventInfo from "../../event/EventInfo"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import ViewMorePagination from "../tools/ViewMorePagination"
import { affiliateEarningsStatusConfig } from "../resources/status-config"
import { Icon } from "@iconify/react"
import TableLoader from "@/components/loaders/TableLoader"

interface EarningHistoryTableProps {
    items:         EarningHistoryItem[]
    isLoading:     boolean
    isLoadingMore: boolean
    hasNext:       boolean
    count:         number
    onLoadMore:    () => void
    isEmpty:       boolean
    isError:       boolean
    search:        string
}

export default function EarningHistoryTable({
    items,
    isLoading,
    isLoadingMore,
    hasNext,
    count,
    onLoadMore,
    isEmpty,
    isError,
    search,
}: EarningHistoryTableProps) {

    if (isLoading) return <TableLoader />

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-5">
            <div className="p-3 rounded-full bg-red-50">
                <Icon icon="mage:warning-circle" className="size-6 text-red-400" />
            </div>
            <p className="text-sm font-medium text-brand-secondary-8">Something went wrong</p>
            <p className="text-xs text-brand-secondary-5">Could not load earnings. Please try again.</p>
        </div>
    )

    if (isEmpty && search) return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-5">
            <div className="p-3 rounded-full bg-brand-neutral-2">
                <Icon icon="mage:search" className="size-6 text-brand-neutral-6" />
            </div>
            <p className="text-sm font-medium text-brand-secondary-8">
                No results for &ldquo;{search}&rdquo;
            </p>
            <p className="text-xs text-brand-secondary-5">Try a different event name or clear the search</p>
        </div>
    )

    if (isEmpty || items.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-5">
            <div className="p-3 rounded-full bg-brand-neutral-2">
                <Icon icon="hugeicons:money-receive-square" className="size-6 text-brand-neutral-6" />
            </div>
            <p className="text-sm font-medium text-brand-secondary-8">No earnings yet</p>
            <p className="text-xs text-brand-secondary-5">Your earnings history will appear here once you start earning commissions.</p>
        </div>
    )

    return (
        <div className="w-full space-y-4 mt-5">
            {/* Desktop Table */}
            <div className="hidden md:block border border-brand-neutral-3 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr className="text-brand-secondary-8 text-xs font-semibold">
                                <th className="text-left py-4 px-4">S/N</th>
                                <th className="text-left py-4 px-4">Date</th>
                                <th className="text-left py-4 px-4">Event Name</th>
                                <th className="text-center py-4 px-4">Tickets Sold</th>
                                <th className="text-center py-4 px-4">Total Sale</th>
                                <th className="text-center py-4 px-4">Your Commission</th>
                                <th className="text-left py-4 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-4 bg-white">
                            {items.map((item, index) => {
                                const status = affiliateEarningsStatusConfig[item.status.toLowerCase() as keyof typeof affiliateEarningsStatusConfig]
                                return (
                                    <tr key={item.id} className="hover:bg-brand-neutral-1/50 transition-colors">
                                        <td className="py-4 px-4 text-brand-secondary-6 text-xs">{index + 1}</td>
                                        <td className="p-4 text-brand-secondary-8 text-xs whitespace-nowrap">{item.created_at}</td>
                                        <td className="p-4 min-w-40">
                                            <EventInfo
                                                variant="desktop"
                                                category={item.category}
                                                image={item.event_image}
                                                title={item.event_name}
                                            />
                                        </td>
                                        <td className="p-4 text-brand-secondary-8 text-xs text-center">{item.tickets_sold}</td>
                                        <td className="p-4 text-brand-secondary-9 text-xs whitespace-nowrap text-cente">{item.total_sale}</td>
                                        <td className="p-4 text-brand-secondary-9 text-xs whitespace-nowrap text-center">{item.your_commission}</td>
                                        <td className="p-4">
                                            <Badge className={cn("px-3 py-1 text-[10px] rounded-sm font-medium shadow-none", status?.className)}>
                                                {status?.label}
                                            </Badge>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-0 divide-y divide-brand-neutral-4">
                {items.map((item) => {
                    const status = affiliateEarningsStatusConfig[item.status as keyof typeof affiliateEarningsStatusConfig]
                    return (
                        <div key={item.id} className="py-5 px-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <EventInfo
                                    variant="mobile"
                                    category={item.category}
                                    image={item.event_image}
                                    title={item.event_name}
                                />
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-brand-secondary-5 text-[10px] font-medium">Status</span>
                                    <Badge className={cn("px-3 py-1 text-[10px] font-medium shadow-none", status?.className)}>
                                        {status?.label}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-brand-secondary-5 text-xs">
                                    <span>{item.created_at}</span>
                                    <span>|</span>
                                    <span>{item.tickets_sold} Tickets Sold</span>
                                </div>
                                <div className="flex justify-between text-brand-secondary-9 text-[11px] items-center">
                                    <div className="flex gap-1 items-center">
                                        <span className="font-bold text-xs">Total Sale:</span>
                                        <span>{item.total_sale}</span>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <span className="font-bold text-xs">Commission:</span>
                                        <span>{item.your_commission}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <ViewMorePagination
                hasMore={hasNext}
                onViewMore={onLoadMore}
                isLoading={isLoadingMore}
                currentCount={items.length}
                totalCount={count}
            />
        </div>
    )
}