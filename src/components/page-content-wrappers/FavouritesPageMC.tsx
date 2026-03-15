"use client"

import { Dispatch, SetStateAction, useMemo, useState } from "react"
import EventsCard from "@/components/cards/EventCard"
import DataDisplayTableWrapper from "@/components/custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import { FavouritesPageFiltersNTabsData } from "@/components/custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import SavedTicketsTable from "@/components/custom-utils/TableDataDisplayAreas/tables/SavedTicketsTable"
import ViewMorePagination from "@/components/custom-utils/TableDataDisplayAreas/tools/ViewMorePagination"
import EmptyTicketsState from "@/components/custom-utils/TableDataDisplayAreas/empty-state"
import { FAVOURITES_ENDPOINT } from "@/endpoints"
import { Icon } from "@iconify/react"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import { fromFavouriteEvent } from "@/components/cards/resources/event-card-adapter"
import { deriveCategories } from "@/helper-fns/deriveCategories"
import EventCardLoaderContainer from "../loaders/EventCardLoader"
import { ApiCategory } from "@/actions/filters"



interface Props {
    initialData: TabSlice<FavouriteEvent>
    categories:  ApiCategory[]
}

export default function FavouritesPageCW({ initialData, categories }: Props) {

    const { filterOptions, tabList } = FavouritesPageFiltersNTabsData

    const [filters,     setFilters]     = useState<Partial<FilterValues>>({})
    const [activeTab,   setActiveTab]   = useState<typeof tabList[number]["value"]>("saved")
    const [displayType, setDisplayType] = useState<"grid" | "list">("grid")

    const { activeTabState } = useDataDisplay<FavouriteEvent>(
        {
            endpoint: FAVOURITES_ENDPOINT,
            tabs: [{ key: "saved", initialData, staticParams: {} }],
            activeTab,
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

    const renderContent = () => {
        if (isLoading) {
            return displayType === "grid" ? <EventCardLoaderContainer /> : null
        }

        if (isError) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-10">
                <div className="p-3 rounded-full bg-red-50">
                    <Icon icon="mage:warning-circle" className="size-6 text-red-400" />
                </div>
                <p className="text-sm font-medium text-brand-secondary-8">Something went wrong</p>
                <p className="text-xs text-brand-secondary-5">Could not load saved events. Please try again.</p>
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
                <p className="text-xs text-brand-secondary-5">
                    Try a different event name or clear the search
                </p>
            </div>
        )

        if (isEmpty) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-10">
                <div className="p-3 rounded-full bg-brand-neutral-2">
                    <Icon icon="mage:filter" className="size-6 text-brand-neutral-6" />
                </div>
                <p className="text-sm font-medium text-brand-secondary-8">No events match your filters</p>
                <p className="text-xs text-brand-secondary-5">Try adjusting or clearing your filters</p>
            </div>
        )

        if (items.length === 0) return (
            <div className="mt-10">
                <EmptyTicketsState
                    href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/events/`}
                    text="When you find events you like, click the heart icon to save them here"
                    title="No Saved Events Yet"
                    btnText="Browse Events"
                    icon="clarity:heart-broken-line"
                />
            </div>
        )

        if (displayType === "grid") return (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(14em,1fr))] md:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(14em,1fr))] gap-6 lg:gap-8 mt-10 justify-items-center md:justify-items-start">
                {items.map((event) => (
                    <EventsCard key={event.id} {...fromFavouriteEvent(event)} />
                ))}
            </div>
        )

        return (
            <SavedTicketsTable
                tickets={items}
                isLoadingMore={isLoadingMore}
                hasNext={hasNext}
                count={count}
                onLoadMore={loadMore}
                search={search}
            />
        )
    }

    return (
        <main className="py-10">
            <DataDisplayTableWrapper
                tabs={tabList}
                activeTab={activeTab}
                setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                filterOptions={filterOptions}
                showSearch={true}
                viewMode={displayType}
                setViewMode={setDisplayType}
                categories={availableCategories}
                filters={filters}
                setFilters={setFilters}
                searchPlaceholder="Search saved events..."
                onSearch={handleSearch}
                isLoading={isLoading}
            >
                {renderContent()}

                {displayType === "grid" && !isLoading && !isError && items.length > 0 && (
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