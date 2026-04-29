"use client"

import { useMemo, useState } from "react"
import EventsCard from "@/components/cards/EventCard"
import DataDisplayTableWrapper from "@/components/custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import { MarketplaceFiltersNTabsData } from "@/components/custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import ViewMorePagination from "@/components/custom-utils/TableDataDisplayAreas/tools/ViewMorePagination"
import EmptyTicketsState from "@/components/custom-utils/TableDataDisplayAreas/empty-state"
import { Icon } from "@iconify/react"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import { fromMarketplaceEvent } from "@/components/cards/resources/event-card-adapter"
import { deriveCategories } from "@/helper-fns/deriveCategories"
import EventCardLoaderContainer from "../loaders/EventCardLoader"
import { ApiCategory } from "@/actions/filters"
import { MARKETPLACE_LIST_ENDPOINT } from "@/endpoints"


interface Props {
    initialData: TabSlice<MarketplaceEvent>
    categories: ApiCategory[]
}

const hasActiveFilters = (filters: Partial<FilterValues>) =>
    !!(
        filters.categories?.length ||
        filters.dateRange?.from ||
        filters.dateRange?.to ||
        filters.priceRange?.min ||
        filters.priceRange?.max ||
        filters.status ||
        filters.ticketType?.length ||
        filters.isMineFilter != null
    )

export default function MarketplacePageCW({ initialData, categories }: Props) {

    const { filterOptions } = MarketplaceFiltersNTabsData

    const [filters, setFilters] = useState<Partial<FilterValues>>({})
    const [displayType, setDisplayType] = useState<"grid" | "list">("grid")

    const activeTab = "all"

    const { activeTabState } = useDataDisplay<MarketplaceEvent>(
        {
            endpoint: MARKETPLACE_LIST_ENDPOINT,
            tabs: [{ key: "all", initialData, staticParams: {} }],
            activeTab,
            revalidateTarget: "marketplace"
        },
        filters,
    )

    const availableCategories = useMemo(
        () => deriveCategories(categories, activeTabState.cachedItems),
        [categories, activeTabState.cachedItems]
    )

    const {
        items, isLoading, isLoadingMore,
        hasNext, count, loadMore,
        handleSearch, search,
        isError, isEmpty,
    } = activeTabState

    const filtersActive = hasActiveFilters(filters)


    const renderContent = () => {
        if (isLoading) return <EventCardLoaderContainer />

        if (isError) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-10">
                <div className="p-3 rounded-full bg-red-50">
                    <Icon icon="nonicons:error-16" className="size-6 text-red-400" />
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

        // Empty because of active filters — not the same as "no events in marketplace"
        if (isEmpty && filtersActive) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-10">
                <div className="p-3 rounded-full bg-brand-neutral-2">
                    <Icon icon="mage:filter" className="size-6 text-brand-neutral-6" />
                </div>
                <p className="text-sm font-medium text-brand-secondary-8">No events match your filters</p>
                <p className="text-xs text-brand-secondary-5">Try adjusting or clearing your filters</p>
            </div>
        )

        // Genuinely empty marketplace — no filters, no search, server returned 0
        if (isEmpty || items.length === 0) return (
            <div className="mt-10">
                <EmptyTicketsState
                    href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/events/`}
                    text="No events are available in the marketplace right now. Check back soon!"
                    title="No Events Yet"
                    btnText="Explore Events"
                    icon="hugeicons:ticket-01"
                />
            </div>
        )

        return (
            <div className="grid p-1 grid-cols-[repeat(auto-fill,minmax(14em,1fr))] md:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(16em,1fr))] gap-y-6 gap-x-4 justify-items-center md:justify-items-start">
                {items.map(event => (
                    <EventsCard key={event.id} {...fromMarketplaceEvent(event)} eventCardFor="marketplace" />
                ))}
            </div>
        )
    }

    return (
        <main className="py-10">
            <DataDisplayTableWrapper
                filterOptions={filterOptions}
                showSearch={true}
                viewMode={displayType}
                setViewMode={setDisplayType}
                categories={availableCategories}
                filters={filters}
                setFilters={setFilters}
                searchPlaceholder="Search events..."
                onSearch={handleSearch}
                isLoading={isLoading}
            >
                {renderContent()}

                {!isLoading && !isError && items.length > 0 && (
                    <ViewMorePagination
                        hasMore={hasNext}
                        onViewMore={loadMore}
                        isLoading={isLoadingMore}
                        currentCount={items.length}
                        totalCount={count}
                    />
                )}
            </DataDisplayTableWrapper>
        </main>
    )
}