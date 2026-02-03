"use client"

import EventsCard from "@/components/cards/EventCard";
import DataDisplayTableWrapper from "@/components/custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper";
import { FavouritesPageFiltersNTabsData } from "@/components/custom-utils/TableDataDisplayAreas/resources/avaliable-filters";
import SavedTicketsTable from "@/components/custom-utils/TableDataDisplayAreas/tables/SavedTicketsTable";
import ViewMorePagination from "@/components/custom-utils/TableDataDisplayAreas/tools/ViewMorePagination";
import { usePagination } from "@/custom-hooks/PaginationHook";
import { eventsMock } from "@/mock-data";
import { Dispatch, SetStateAction, useState } from "react";
import EmptyTicketsState from "../custom-utils/TableDataDisplayAreas/empty-state";
import { DISCOVER_EVENTS } from "@/enums/navigation";

export default function FavouritesPageCW(){

    const { filterOptions, tabList } = FavouritesPageFiltersNTabsData;
    const [filters, setFilters] = useState<Partial<FilterValues>>({})
    const pagination = usePagination(eventsMock, 3)
    const [activeTab, setActiveTab] = useState<typeof FavouritesPageFiltersNTabsData.tabList[number]["value"]>("saved")
    const [displayType, setDisplayType] = useState<"grid" | "list">("grid")

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
                filters={filters}
                setFilters={setFilters}
                searchPlaceholder="Search Ticket By Event Name..."
            >
                {
                    eventsMock.length ?
                    (
                        displayType === "grid" ?
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(14em,1fr))] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(14em,1fr))] gap-6 lg:gap-8 mt-10 justify-items-center md:justify-items-start">
                            {pagination.currentItems.map((event) => (
                                <EventsCard 
                                    key={event.href}
                                    {...event} 
                                />
                            ))}
                        </div>
                        :
                        <SavedTicketsTable />
                    )
                    :
                    <div className="mt-10">
                        <EmptyTicketsState 
                            href={DISCOVER_EVENTS.MAIN.href}
                            text="When you find events you like, Click the heart icon to save them here"
                            title="No Saved Events Yet"
                            btnText="Browse Events"
                            icon="clarity:heart-broken-line"
                        />
                    </div>
                }

                <ViewMorePagination
                    hasMore={pagination.currentItems.length < eventsMock.length}
                    onViewMore={() => pagination.setPageSize(6)}
                    isLoading={false}
                    currentCount={pagination.currentItems.length}
                    totalCount={pagination.totalItems}
                />
            </DataDisplayTableWrapper>
        </main>
    )
}