"use client"

import { useState } from "react";
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import { MarketplaceFiltersNTabsData } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import { usePagination } from "@/custom-hooks/PaginationHook";
import { eventsMock } from "@/mock-data";
import EventsCard from "../cards/EventCard";
import ViewMorePagination from "../custom-utils/TableDataDisplayAreas/tools/ViewMorePagination";

export default function MarketplaceCW(){

    const { filterOptions, tabList } = MarketplaceFiltersNTabsData;
    const [filters, setFilters] = useState<Partial<FilterValues>>({})
    const pagination = usePagination(eventsMock, 3)

    return (
        <main className="py-10">
            <DataDisplayTableWrapper 
                tabs={tabList}
                filterOptions={filterOptions}
                showSearch={true}
                filters={filters}
                setFilters={setFilters}
                searchPlaceholder="Search Ticket By Event Name..."
            >
                <div className="grid grid-cols-[repeat(auto-fit,minmax(14em,1fr))] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(14em,1fr))] gap-6 lg:gap-8 mt-10 justify-items-center md:justify-items-start">
                    {pagination.currentItems.map((event) => (
                        <EventsCard 
                            key={event.href}
                            {...event} 
                        />
                    ))}
                </div>

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