"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import EventInfo from "../../event/EventInfo"
import NoUpcomingEvents from "../empty-state"
import { cn } from "@/lib/utils"
import ViewMorePagination from "../tools/ViewMorePagination"
import { Badge } from "@/components/ui/badge"
import { statusStyles } from '../../../cards/resources/event-status-styles'
import { EventIconActionButton } from "@/components/buttons/EventIconActionButton"
import { copyToClipboard } from "@/helper-fns/copyToClipboard"
import ShareEventModal from "@/components/modals/ShareEventModal"
import { EventCardProps, fromFavouriteEvent } from "@/components/cards/resources/event-card-adapter"
import { EVENT_DETAILS_LINK } from "@/enums/navigation"


// Per-row actions

const RowActions = ({ id, title }: { id: string; title: string }) => {
    const [showShare,   setShowShare]   = useState(false)
    const [isFavourite, setIsFavourite] = useState(true)

    const handleShare = () => {
        setShowShare(true)
    }

    return (
        <>
            <div className="flex gap-2 items-center">
                <EventIconActionButton
                    icon="hugeicons:share-08"
                    onClick={handleShare}
                    className="hover:text-white"
                    feedback="Opening share..."
                />
                <EventIconActionButton
                    icon="ph:link-bold"
                    onClick={() => copyToClipboard(EVENT_DETAILS_LINK.replace("[event_id]", id))}
                    className="hover:text-white"
                    feedback="Link copied!"
                />
                <EventIconActionButton
                    icon={isFavourite ? "hugeicons:favourite-square" : "hugeicons:favourite"}
                    onClick={() => setIsFavourite(p => !p)}
                    className={cn("hover:text-white", isFavourite && "text-red-500!")}
                    feedback={isFavourite ? "Removed from favourites" : "Saved!"}
                />
            </div>

            <ShareEventModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                shareUrl={EVENT_DETAILS_LINK.replace("[event_id]", id)}
                title={title}
            />
        </>
    )
}

// Status badge

const StatusBadge = ({ status }: { status: string }) => {
    const style = statusStyles[status as keyof typeof statusStyles]
    return (
        <Badge className={cn(
            "py-1 px-2 rounded-2xl text-xs font-medium capitalize border-0",
            style?.bg   ?? "bg-brand-neutral-3",
            style?.text ?? "text-brand-secondary-7",
        )}>
            {status}
        </Badge>
    )
}

// Table

interface Props {
    tickets:        FavouriteEvent[]
    isLoading?:     boolean
    isLoadingMore?: boolean
    hasNext?:       boolean
    count?:         number
    onLoadMore?:    () => void
    search?:        string
}

export default function SavedTicketsTable({
    tickets = [],
    isLoadingMore,
    hasNext,
    count,
    onLoadMore,
    search,
}: Props) {

    // Normalize once at the top — all field access below uses the adapter shape
    const rows : EventCardProps[] = tickets.map(fromFavouriteEvent)

    if (!rows.length) {
        if (search) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-10">
                <div className="p-3 rounded-full bg-brand-neutral-2">
                    <Icon icon="mage:search" className="size-6 text-brand-neutral-6" />
                </div>
                <p className="text-sm font-medium text-brand-secondary-8">No results for &ldquo;{search}&rdquo;</p>
                <p className="text-xs text-brand-secondary-5">Try a different event name or clear the search</p>
            </div>
        )

        return (
            <div className="my-10">
                <NoUpcomingEvents
                    title="No Saved Events"
                    href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/events/`}
                    text="You don't have any saved events yet. Start exploring amazing events!"
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
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Event</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Date & Time</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Host</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {rows.map((row) => (
                                <tr key={row.id} className="hover:bg-brand-neutral-1/50 transition-colors">
                                    <td className="py-4 px-4">
                                        <StatusBadge status={row.status ?? "unknown"} />
                                    </td>

                                    <td className="p-4 min-w-40">
                                        <EventInfo
                                            variant="desktop"
                                            image={row.image}
                                            title={row.title}
                                            category={row.category}
                                        />
                                    </td>

                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1">
                                                <div className="flex items-center gap-0.5">
                                                    <Icon icon="hugeicons:calendar-04" className="size-4 shrink-0 text-brand-accent-6" />
                                                    <hr className="w-px h-2 border border-brand-neutral-6" />
                                                    <Icon icon="hugeicons:clock-01" className="size-4 shrink-0 text-brand-accent-6" />
                                                </div>
                                                <span className="text-brand-neutral-7 text-[11px] truncate">
                                                    {row.date}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Icon icon="hugeicons:location-01" className="size-3.5 text-brand-accent-6" />
                                                <span className="text-brand-secondary-7 text-[11px] truncate max-w-37.5">
                                                    {row.location}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex flex-col items-center gap-1 text-center">
                                            <p className="text-brand-neutral-7 text-[11px]">Hosted by {row.host}</p>
                                            <Badge className="bg-brand-accent-1 text-brand-accent-7 font-medium py-1 px-2 rounded-lg text-xs border-0">
                                                {row.category}
                                            </Badge>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <RowActions id={row.id} title={row.title} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {rows.map((row) => (
                    <div key={row.id} className="border-b border-brand-neutral-4 rounded-2xl py-3">
                        <div className="mb-3 flex justify-between items-center flex-wrap">
                            <StatusBadge status={row.status ?? "unknown"} />
                            <RowActions id={row.id} title={row.title} />
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <EventInfo
                                variant="mobile"
                                image={row.image}
                                title={row.title}
                                category={row.category}
                            />
                        </div>

                        <div className="flex items-center flex-wrap gap-2 border-y border-brand-neutral-2 py-2">
                            <div className="flex items-center gap-1">
                                <div className="flex items-center gap-0.5">
                                    <Icon icon="hugeicons:calendar-04" className="size-4 shrink-0 text-brand-accent-6" />
                                    <hr className="w-px h-2 border border-brand-neutral-6" />
                                    <Icon icon="hugeicons:clock-01" className="size-4 shrink-0 text-brand-accent-6" />
                                </div>
                                <span className="text-brand-neutral-7 text-[11px] truncate">
                                    {row.date}
                                </span>
                            </div>
                            <div className="ml-auto">
                                <span className="text-brand-neutral-7 text-[11px]">Hosted by {row.host}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center gap-1">
                                <Icon icon="hugeicons:location-01" className="size-4 text-brand-accent-6" />
                                <span className="text-brand-secondary-7 text-[11px] truncate max-w-45">
                                    {row.location}
                                </span>
                            </div>
                            <Badge className="bg-brand-accent-1 text-brand-accent-7 font-medium py-1 px-2 rounded-lg text-xs border-0">
                                {row.category}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>

            <ViewMorePagination
                hasMore={hasNext ?? false}
                onViewMore={onLoadMore ?? (() => {})}
                isLoading={isLoadingMore ?? false}
                currentCount={rows.length}
                totalCount={count ?? rows.length}
            />
        </div>
    )
}