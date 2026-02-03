"use client";

import { Icon } from "@iconify/react";
import { usePagination } from "@/custom-hooks/PaginationHook";
import EventInfo from "../../event/EventInfo";
import { eventsMock } from "@/mock-data";
import NoUpcomingEvents from "../empty-state";
import { DISCOVER_EVENTS } from "@/enums/navigation";
import { cn } from "@/lib/utils";
import ViewMorePagination from "../tools/ViewMorePagination";
import { Badge } from "@/components/ui/badge";
import { statusStyles } from '../../../cards/resources/event-status-styles'
import { EventIconActionButton } from "@/components/buttons/EventIconActionButton";
import { copyToClipboard } from "@/helper-fns/copyToClipboard";
import { space_grotesk } from "@/lib/fonts";

export default function SavedTicketsTable() {
    const pagination = usePagination(eventsMock, 5)

    const MyCustomBadge = ({ status }: { status: keyof typeof statusStyles }) => {
        const item = statusStyles[status]
        if (!item) return null;
        return (
            <Badge
                className={cn(
                    "py-1 px-2 rounded-2xl text-center text-xs font-medium capitalize border-0",
                    item.bg,
                    item.text,
                )}
            >
                {status}
            </Badge>
        )
    }

    return (
        !eventsMock.length ?
        <div className="my-10">
            <NoUpcomingEvents 
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
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Event</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Price</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Date, Time & Location</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Host</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {pagination.currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-brand-neutral-1/50 transition-colors group">
                                    <td className="py-4 px-4">
                                        <MyCustomBadge status={item.status!} />
                                    </td>

                                    <td className="p-4 min-w-40">
                                        <EventInfo 
                                            variant="desktop"
                                            image={item.image}
                                            title={item.title}
                                            category={item.category}
                                        />
                                    </td>

                                    <td className={cn(space_grotesk.className, "p-4 text-brand-secondary-9 font-medium text-sm")}>
                                        {item.price?.toLocaleString()}
                                    </td>

                                    {/* Date, Time & Location */}
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1">
                                                <div className="flex items-center gap-0.5">
                                                    <Icon icon="hugeicons:calendar-04" className="size-4 shrink-0 text-brand-accent-6" />
                                                    <hr className="w-px h-2 border border-brand-neutral-6" />
                                                    <Icon icon="hugeicons:clock-01" className="size-4 shrink-0 text-brand-accent-6" />
                                                </div>
                                                <span className="text-brand-neutral-7 text-[11px] truncate flex-1">
                                                    {item.date}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Icon icon="hugeicons:location-01" className="size-3.5 text-brand-accent-6" />
                                                <span className="text-brand-secondary-7 text-[11px] truncate max-w-37.5">
                                                    {item.location}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="space-y-1 flex justify-center items-center flex-col text-center">
                                            <p className="text-brand-neutral-7 text-[11px]">Hosted By Qavdev</p>
                                            <Badge className="bg-brand-accent-1 text-brand-accent-7 font-medium py-1 px-2 rounded-lg text-xs border-0">
                                                {item.category}
                                            </Badge>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4">
                                        <div className="flex gap-2 items-center">
                                            <EventIconActionButton 
                                                icon="hugeicons:share-08" 
                                                onClick={() => {}} 
                                                className="hover:text-white"
                                                feedback="Shared"
                                            />
                                            <EventIconActionButton 
                                                icon="ph:link-bold" 
                                                onClick={() => {
                                                    copyToClipboard(item.href)
                                                }} 
                                                className="hover:text-white"
                                                feedback="Event link copied"
                                            />
                                            <EventIconActionButton 
                                                icon="hugeicons:favourite" 
                                                onClick={() => {
                                                }} 
                                                className="hover:text-white"
                                                feedback="Added to favourites"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {pagination.currentItems.map((item) => (
                    <div key={item.id} className="border-b border-brand-neutral-4 rounded-2xl py-3">
                        {/* Status Badge */}
                        <div className="mb-3 flex justify-between items-center flex-wrap">
                            <MyCustomBadge status={item.status!} />
                            
                            {/* Action Buttons */}
                            <div className="flex justify-between items-center border-t border-brand-neutral-1">
                                <div className="flex gap-3">
                                    <EventIconActionButton 
                                        icon="hugeicons:share-08" 
                                        onClick={() => {}} 
                                        className="hover:text-white"
                                        feedback="Shared"
                                    />
                                    <EventIconActionButton 
                                        icon="ph:link-bold" 
                                        onClick={() => copyToClipboard(item.href)} 
                                        className="hover:text-white"
                                        feedback="Event link copied"
                                    />
                                    <EventIconActionButton 
                                        icon="hugeicons:favourite" 
                                        onClick={() => {}} 
                                        className="hover:text-white"
                                        feedback="Added to favourites"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Event Info & Price */}
                        <div className="flex justify-between items-start mb-4">
                            <EventInfo 
                                variant="mobile"
                                image={item.image}
                                title={item.title}
                                category={item.category}
                            />
                            <span className={cn(space_grotesk.className, "text-brand-secondary-9 font-bold text-sm ml-2")}>
                                {item.price}
                            </span>
                        </div>

                        {/* Date | Time | Hosted By */}
                        <div className="flex items-center flex-wrap gap-2 border-y border-brand-neutral-2">
                            <div className="flex items-center gap-1">
                                <div className="flex items-center gap-0.5">
                                    <Icon icon="hugeicons:calendar-04" className="size-4 shrink-0 text-brand-accent-6" />
                                    <hr className="w-px h-2 border border-brand-neutral-6" />
                                    <Icon icon="hugeicons:clock-01" className="size-4 shrink-0 text-brand-accent-6" />
                                </div>
                                <span className="text-brand-neutral-7 text-[11px] truncate flex-1">
                                    {item.date}
                                </span>
                            </div>
                            <div className="ml-auto flex flex-col items-center gap-1">
                                <span className="text-brand-neutral-7 text-[11px]">Hosted by Qavdev</span>
                            </div>
                        </div>

                        {/* Location & Category */}
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-1">
                                <Icon icon="hugeicons:location-01" className="size-4 text-brand-accent-6" />
                                <span className="text-brand-secondary-7 text-[11px] truncate max-w-45">
                                    {item.location}
                                </span>
                            </div>
                            <Badge className="bg-brand-accent-1 text-brand-accent-7 font-medium py-1 px-2 rounded-lg text-xs border-0">
                                {item.category}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>

            <ViewMorePagination
                hasMore={pagination.currentItems.length < eventsMock.length}
                onViewMore={() => pagination.setPageSize(pagination.pageSize + 5)}
                isLoading={false}
                currentCount={pagination.currentItems.length}
                totalCount={eventsMock.length}
            />
        </div>
    )
}