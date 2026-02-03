"use client"

import { cn } from "@/lib/utils";
import { space_grotesk } from "@/lib/fonts";
import { usePagination } from "@/custom-hooks/PaginationHook";
import EventsCard from "../cards/EventCard";
import ViewMorePagination from "../custom-utils/TableDataDisplayAreas/tools/ViewMorePagination";

interface AffiliateLinksTabContentProps {
    events: any[] 
    initialPageSize?: number
}

export default function AffiliateLinksTabContent({ 
    events, 
    initialPageSize = 3 
}: AffiliateLinksTabContentProps) {
    const pagination = usePagination(events, initialPageSize)

    return (
        <section className="mt-8">
            <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold md:text-lg mb-5")}>
                Available Events
            </h3>
            
            <div className="grid grid-cols-[repeat(auto-fit,minmax(14em,1fr))] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(14em,1fr))] gap-6 lg:gap-8 justify-items-center md:justify-items-start">
                {pagination.currentItems.map((event) => (
                    <EventsCard 
                        key={event.href}
                        {...event} 
                    />
                ))}
            </div>

            <ViewMorePagination
                hasMore={pagination.currentItems.length < events.length}
                onViewMore={() => pagination.setPageSize(pagination.pageSize + 3)}
                isLoading={false}
                currentCount={pagination.currentItems.length}
                totalCount={pagination.totalItems}
            />
        </section>
    )
}