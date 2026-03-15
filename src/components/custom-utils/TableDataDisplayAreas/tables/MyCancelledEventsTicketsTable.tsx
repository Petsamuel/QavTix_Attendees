"use client"

import EventInfo from "../../event/EventInfo"
import { Badge } from "@/components/ui/badge"
import NoCancelledEvents from "../empty-state/index"
import ViewTicket from "../actions/ViewTicket"
import DownloadTicket from "../actions/DownloadTicket"
import ViewMorePagination from "../tools/ViewMorePagination"
import TableLoader from "@/components/loaders/TableLoader"
import { Icon } from "@iconify/react"


interface Props {
    tickets:       EventTicket[]
    isLoading:     boolean
    isLoadingMore: boolean
    hasNext:       boolean
    count:         number
    onLoadMore:    () => void
    search:        string
}

export default function MyCancelledEventsTicketsTable({
    tickets, isLoading, search, isLoadingMore, hasNext, count, onLoadMore
}: Props) {

    if (isLoading) return <TableLoader />
    // No results — distinguish between empty data vs no search results
    if (!tickets.length) {
        if (search) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="p-3 rounded-full bg-brand-neutral-2">
                    <Icon icon="mage:search" className="size-6 text-brand-neutral-6" />
                </div>
                <p className="text-sm font-medium text-brand-secondary-8">
                    No results for &ldquo;{search}&rdquo;
                </p>
                <p className="text-xs text-brand-secondary-5">
                    Try a different event name or clear the search
                </p>
            </div>
        )

        return (
            <div className="my-10">
                <NoCancelledEvents
                    title="No Cancelled Event Tickets"
                    href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/events`}
                    text="You don't have any cancelled tickets yet."
                />
            </div>
        )
    }

    return (
        <div className="w-full space-y-4 mt-5">
            {/* Desktop Table */}
            <div className="hidden md:block border border-brand-neutral-2 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3/80 border-b border-brand-neutral-3">
                            <tr>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap w-16">S/N</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Event Name</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Date & Time</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-5 bg-white">
                            {tickets.map((item) => (
                                <tr key={item.id} className="hover:bg-brand-neutral-3/50 transition-colors group">
                                    <td className="py-4 px-4 text-brand-secondary-8 text-xs text-center">{item.sn}</td>
                                    <td className="p-4 min-w-40">
                                        <EventInfo variant="desktop" category={item.category} image={item.event_image} title={item.event_name} />
                                    </td>
                                    <td className="p-4">
                                        <Badge className="border-[0.81px] border-brand-accent-2 bg-brand-accent-1 rounded-sm text-xs text-brand-accent-4">
                                            Cancelled
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-brand-secondary-9 text-xs whitespace-nowrap">
                                        {new Date(item.event_datetime).toLocaleDateString()} | {new Date(item.event_datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-4 text-brand-secondary-9 text-xs font-bold">
                                            <ViewTicket ticket={item} />
                                            <DownloadTicket ticket={item} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-3">
                {tickets.map((item) => (
                    <div key={item.id} className="border-b border-brand-neutral-5 py-3">
                        <div className="flex justify-between items-start">
                            <EventInfo variant="mobile" category={item.category} image={item.event_image} title={item.event_name} />
                            <span className="text-brand-secondary-5 text-[11px]">
                                {new Date(item.event_datetime).toLocaleDateString()} | {new Date(item.event_datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                        <div className="flex flex-wrap mt-3 gap-x-5 gap-y-2 text-brand-secondary-9 text-[11px] font-bold">
                            <ViewTicket ticket={item} />
                            <DownloadTicket ticket={item} />
                            <Badge className="border-[0.81px] border-brand-accent-2 bg-brand-accent-1 rounded-sm text-xs text-brand-accent-4">
                                Cancelled
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>

            <ViewMorePagination
                hasMore={hasNext}
                onViewMore={onLoadMore}
                isLoading={isLoadingMore}
                currentCount={tickets.length}
                totalCount={count}
            />
        </div>
    )
}