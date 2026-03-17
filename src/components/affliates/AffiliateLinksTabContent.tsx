"use client"

import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import EventsCard from "../cards/EventCard"
import ViewMorePagination from "../custom-utils/TableDataDisplayAreas/tools/ViewMorePagination"
import { fromAffiliateEvent } from "../cards/resources/event-card-adapter"
import { Icon } from "@iconify/react"
import EventCardLoaderContainer from "../loaders/EventCardLoader"

interface AffiliateLinksTabContentProps {
    items:         AffiliateEvent[]
    isLoading:     boolean
    isLoadingMore: boolean
    hasNext:       boolean
    count:         number
    onLoadMore:    () => void
    isEmpty:       boolean
    isError:       boolean
    search:        string
}

export default function AffiliateLinksTabContent({
    items,
    isLoading,
    isLoadingMore,
    hasNext,
    count,
    onLoadMore,
    isEmpty,
    isError,
    search,
}: AffiliateLinksTabContentProps) {

    if (isLoading) return <EventCardLoaderContainer />

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-10">
            <div className="p-3 rounded-full bg-red-50">
                <Icon icon="mage:warning-circle" className="size-6 text-red-400" />
            </div>
            <p className="text-sm font-medium text-brand-secondary-8">Something went wrong</p>
            <p className="text-xs text-brand-secondary-5">Could not load events. Please try again.</p>
        </div>
    )

    if (isEmpty && search) return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-10">
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
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-10">
            <div className="p-3 rounded-full bg-brand-neutral-2">
                <Icon icon="hugeicons:ticket-01" className="size-6 text-brand-neutral-6" />
            </div>
            <p className="text-sm font-medium text-brand-secondary-8">No events available</p>
            <p className="text-xs text-brand-secondary-5">There are no events to promote right now. Check back soon!</p>
        </div>
    )

    return (
        <section className="mt-2">
            <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold md:text-lg mb-5")}>
                Available Events
            </h3>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(14em,1fr))] md:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(16em,1fr))] gap-y-6 gap-x-4 justify-items-center md:justify-items-start">
                {items.map((event) => (
                    <EventsCard
                        key={event.id}
                        {...fromAffiliateEvent(event)}
                    />
                ))}
            </div>

            <ViewMorePagination
                hasMore={hasNext}
                onViewMore={onLoadMore}
                isLoading={isLoadingMore}
                currentCount={items.length}
                totalCount={count}
            />
        </section>
    )
}