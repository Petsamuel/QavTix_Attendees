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
import { ApiCategory } from "@/actions/filters/index"
import { PLATFORM_CURRENCY } from "@/components-data/currencies"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { useRouter } from "next/navigation"
import { SETTINGS_SUB_LINKS } from "@/enums/navigation"


interface MyTicketsPageCWProps {
    metrics: AttendeeDashboardMetrics
    categories: ApiCategory[]
    upcoming: TabSlice<EventTicket>
    past: TabSlice<EventTicket>
    cancelled: TabSlice<EventTicket>
}

export default function MyTicketsPageCW({ metrics, categories, upcoming, past, cancelled }: MyTicketsPageCWProps) {

    const { filterOptions, tabList } = MyTicketsFiltersNTabsData
    const [filters, setFilters] = useState<Partial<FilterValues>>({
        dateRange: { from: undefined, to: undefined },
        categories: [],
    })
    const [activeTab, setActiveTab] = useState<typeof tabList[number]["value"]>("upcoming")

    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()
    const router = useRouter()

    const currency = isMounted
        ? (user?.currency || PLATFORM_CURRENCY)
        : PLATFORM_CURRENCY

    const { tabStates, activeTabState } = useDataDisplay<EventTicket>(
        {
            endpoint: ATTENDEE_DASHBOARD_ENDPOINT,
            tabs: [
                { key: "upcoming", initialData: upcoming, staticParams: { event_status: "active" } },
                { key: "past", initialData: past, staticParams: { past: "true" } },
                { key: "cancelled", initialData: cancelled, staticParams: { event_status: "cancelled" } },
            ],
            activeTab,
            revalidateTarget: "tickets",
        },
        filters,
    )

    const availableCategories = useMemo(
        () => deriveCategories(categories, activeTabState.cachedItems),
        [categories, activeTabState.cachedItems]
    )

    // currency is stable on the server (PLATFORM_CURRENCY) and only updates
    // after mount — so formatPrice will never produce a server/client mismatch.
    const analyticsMetrics = useMemo(
        () => buildMetricsFromConfig(myTicketsMetricsConfig, {
            "total-earnings": metrics.total_earnings,
            "total-spent": metrics.total_spent,
            "ticket-purchased": metrics.tickets_purchased,
            "upcoming-events": metrics.upcoming_events,
        }, currency),
        // Re-format whenever the real currency arrives post-mount
        [metrics, currency]
    )

    const handleTabChange = (tab: string) => {
        // Reset the leaving tab's search
        tabStates.upcoming.resetSearch()
        tabStates.past.resetSearch()
        tabStates.cancelled.resetSearch()
        setActiveTab(tab as typeof activeTab)
    }

    return (
        <main className="mt-6 pb-12">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-0">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>Overview</h2>
                <div className="flex gap-6 items-center">
                    {
                        isMounted && user && !user.is_completed && (
                            <button className="text-brand-primary-6 font-bold text-sm hidden md:inline-block">Complete Profile</button>
                        )}
                    <ExportButton1
                        data={activeTabState.cachedItems}
                        filename={`my-tickets-${activeTab}`}
                        showFormatSelector={false}
                    />
                </div>
            </div>
            {
                isMounted && user && !user.is_completed && (
                    <button onClick={() => router.push(SETTINGS_SUB_LINKS[0].href)} className="text-brand-primary-6 font-bold text-sm mb-4 md:hidden">
                        Complete Profile
                    </button>
                )}

            <AnalyticsMetricsCardsContainer metrics={analyticsMetrics} />

            <section className="mt-10">
                <DataDisplayTableWrapper
                    filters={filters}
                    setFilters={setFilters}
                    tabs={tabList}
                    activeTab={activeTab}
                    setActiveTab={handleTabChange as Dispatch<SetStateAction<string>>}
                    filterOptions={filterOptions}
                    categories={availableCategories}
                    currentSearch={activeTabState.search}
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