"use client";

import { usePagination } from "@/custom-hooks/PaginationHook";
import EventInfo from "../../event/EventInfo";
import { Badge } from "@/components/ui/badge";
import NoPastEvents from "../empty-state/index";
import ViewTicket from "../actions/ViewTicket";
import { mockMyTicketsTableData } from "@/mock-data";
import { DISCOVER_EVENTS } from "@/enums/navigation";
import DownloadTicket from "../actions/DownloadTicket";
import ViewMorePagination from "../tools/ViewMorePagination";

export default function MyCancelledEventsTicketsTable() {


    const pagination = usePagination(mockMyTicketsTableData, 2)

    return (
        !mockMyTicketsTableData.length ?
        <div className="my-10">
            <NoPastEvents 
                title="No Upcoming Tickets"
                href={DISCOVER_EVENTS.MAIN.href}
                text="You don't have any tickets yet. Start exploring amazing events!"
            />
        </div>
        :
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
                            {pagination.currentItems.map((item, index) => (
                                <tr key={item.id} className="hover:bg-brand-neutral-3/50 transition-colors group">
                                    <td className="py-4 px-4 text-brand-secondary-8 text-xs text-center">
                                        {pagination.startIndex + index + 1}
                                    </td>
                                    <td className="p-4 min-w-40">
                                        <EventInfo 
                                            variant="desktop"
                                            category={item.event.category}
                                            image={item.event.image}
                                            title={item.event.title}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <Badge className="border-[0.81px] border-brand-accent-2 bg-brand-accent-1 rounded-sm text-xs text-brand-accent-4">
                                            Resold
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-brand-secondary-9 text-xs whitespace-nowrap">
                                        {item.event.date} | {item.event.time}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-4 text-brand-secondary-9 text-xs font-bold">
                                            <ViewTicket />
                                            <DownloadTicket />
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
                {pagination.currentItems.map((item) => (
                    <div key={item.id} className="border-b border-brand-neutral-5 py-3">
                        <div className="flex justify-between items-start">
                            <EventInfo 
                                variant="mobile"
                                category={item.event.category}
                                image={item.event.image}
                                title={item.event.title}
                            />
                            <span className="text-brand-secondary-5 text-[11px]">
                                {item.event.date} | {item.event.time}
                            </span>
                        </div>

                        <div className="flex flex-wrap mt-3 gap-x-5 gap-y-2 text-brand-secondary-9 text-[11px] font-bold">
                            <ViewTicket />
                            <DownloadTicket />
                            <Badge className="border-[0.81px] border-brand-accent-2 bg-brand-accent-1 rounded-sm text-xs text-brand-accent-4">
                                Resold
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>


            <ViewMorePagination
                hasMore={pagination.currentItems.length < mockMyTicketsTableData.length}
                onViewMore={() => pagination.setPageSize(3)}
                isLoading={false}
                currentCount={pagination.currentItems.length}
                totalCount={pagination.totalItems}
            />
        </div>
    )
}