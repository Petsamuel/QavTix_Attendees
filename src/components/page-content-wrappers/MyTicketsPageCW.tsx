"use client"

import { Dispatch, SetStateAction, useMemo, useState } from "react"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import { buildMetricsFromConfig } from "@/helper-fns/buildMetricsConfig"
import { MyTicketsFiltersNTabsData } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import AnalyticsMetricsCardsContainer from "../cards/AnalyticsMetricsCardsContainer"
import { myTicketsMetricsConfig } from "../cards/resources/metrics-config"
import MyPastEventsTicketsTable from "../custom-utils/TableDataDisplayAreas/tables/MyPastEventsTicketsTable"
import MyUpcomingEventsTicketsTable from "../custom-utils/TableDataDisplayAreas/tables/MyUpcomingEventsTicketsTable"
import MyCancelledEventsTicketsTable from "../custom-utils/TableDataDisplayAreas/tables/MyCancelledEventsTicketsTable"
import { useAppSelector } from "@/lib/redux/hooks"
import { ATTENDEE_DASHBOARD_ENDPOINT } from "@/endpoints"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import { deriveCategories } from "@/helper-fns/deriveCategories"
import { ApiCategory } from "@/actions/filters"



interface MyTicketsPageCWProps {
    metrics:   AttendeeDashboardMetrics
    categories: ApiCategory[]
    upcoming:  TabSlice<EventTicket>
    past:      TabSlice<EventTicket>
    cancelled: TabSlice<EventTicket>
}

export default function MyTicketsPageCW({ metrics, categories, upcoming, past, cancelled }: MyTicketsPageCWProps) {

    const { filterOptions, tabList } = MyTicketsFiltersNTabsData
    const [filters,   setFilters]   = useState<Partial<FilterValues>>({
        dateRange:  { from: undefined, to: undefined },
        categories: [],
    })
    const [activeTab, setActiveTab] = useState<typeof tabList[number]["value"]>("upcoming")
    const { currency } = useAppSelector(store => store.settings)

    const { tabStates, activeTabState } = useDataDisplay<EventTicket>(
        {
            endpoint: ATTENDEE_DASHBOARD_ENDPOINT,
            tabs: [
                { key: "upcoming",  initialData: upcoming,  staticParams: { event_status: "active"   } },
                { key: "past",      initialData: past,      staticParams: { past:         "true"      } },
                { key: "cancelled", initialData: cancelled, staticParams: { event_status: "cancelled" } },
            ],
            activeTab,
        },
        filters,
    )

    // Enrich API categories with counts from the active tab's cached items
    const availableCategories = useMemo(
        () => deriveCategories(categories, activeTabState.cachedItems),
        [categories, activeTabState.cachedItems]
    )

    const analyticsMetrics = buildMetricsFromConfig(myTicketsMetricsConfig, {
        "total-earnings":   metrics.total_earnings,
        "total-spent":      metrics.total_spent,
        "ticket-purchased": metrics.tickets_purchased,
        "upcoming-events":  metrics.upcoming_events,
    }, currency)

    return (
        <main className="mt-6 pb-12">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-0">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>Overview</h2>
                <div className="flex gap-6 items-center">
                    <button className="text-brand-primary-6 font-bold text-sm hidden md:inline-block">Complete Profile</button>
                    <ExportButton1 showFormatSelector={false} />
                </div>
            </div>
            <button className="text-brand-primary-6 font-bold text-sm mb-4 md:hidden">Complete Profile</button>

            <AnalyticsMetricsCardsContainer metrics={analyticsMetrics} />

            <section className="mt-10">
                <DataDisplayTableWrapper
                    filters={filters}
                    setFilters={setFilters}
                    tabs={tabList}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    filterOptions={filterOptions}
                    categories={availableCategories}
                    showSearch={true}
                    searchPlaceholder="Search Ticket By Event Name..."
                    onSearch={activeTabState.handleSearch}
                    isLoading={activeTabState.isLoading}
                >
                    {activeTab === "upcoming" && (
                        <MyUpcomingEventsTicketsTable
                            tickets={tabStates.upcoming.items}
                            isLoading={tabStates.upcoming.isLoading}
                            isLoadingMore={tabStates.upcoming.isLoadingMore}
                            hasNext={tabStates.upcoming.hasNext}
                            count={tabStates.upcoming.count}
                            onLoadMore={tabStates.upcoming.loadMore}
                            search={tabStates.upcoming.search}
                        />
                    )}
                    {activeTab === "past" && (
                        <MyPastEventsTicketsTable
                            tickets={tabStates.past.items}
                            isLoading={tabStates.past.isLoading}
                            isLoadingMore={tabStates.past.isLoadingMore}
                            hasNext={tabStates.past.hasNext}
                            count={tabStates.past.count}
                            onLoadMore={tabStates.past.loadMore}
                            search={tabStates.past.search}
                        />
                    )}
                    {activeTab === "cancelled" && (
                        <MyCancelledEventsTicketsTable
                            tickets={tabStates.cancelled.items}
                            isLoading={tabStates.cancelled.isLoading}
                            isLoadingMore={tabStates.cancelled.isLoadingMore}
                            hasNext={tabStates.cancelled.hasNext}
                            count={tabStates.cancelled.count}
                            onLoadMore={tabStates.cancelled.loadMore}
                            search={tabStates.cancelled.search}
                        />
                    )}
                </DataDisplayTableWrapper>
            </section>
        </main>
    )
}