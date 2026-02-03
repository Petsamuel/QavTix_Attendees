"use client"


import { Dispatch, SetStateAction, useState } from "react"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import { buildMetricsFromConfig } from "@/helper-fns/buildMetricsConfig"
import {  MyTicketsFiltersNTabsData } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import AnalyticsMetricsCardsContainer from "../cards/AnalyticsMetricsCardsContainer"
import { myTicketsMetricsConfig } from "../cards/resources/metrics-config"
import MyPastEventsTicketsTable from "../custom-utils/TableDataDisplayAreas/tables/MyPastEventsTicketsTable"
import MyUpcomingEventsTicketsTable from "../custom-utils/TableDataDisplayAreas/tables/MyUpcomingEventsTicketsTable"
import MyCancelledEventsTicketsTable from "../custom-utils/TableDataDisplayAreas/tables/MyCancelledEventsTicketsTable"


export default function MyTicketsPageCW(){


    const { filterOptions, tabList } = MyTicketsFiltersNTabsData;
    const [filters, setFilters] = useState<Partial<FilterValues>>({})
    const [activeTab, setActiveTab] = useState<typeof MyTicketsFiltersNTabsData.tabList[number]["value"]>("upcoming")

    const apiData = {
        'total-earnings': 612,
        'tickets-spent': 547,
        'ticket-purchased': 17,
        'upcoming-events': 5500
    }

    const analyticsMetrics = buildMetricsFromConfig(myTicketsMetricsConfig, apiData)

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

            <div>
                <AnalyticsMetricsCardsContainer metrics={analyticsMetrics} />
            </div>

            <section className="mt-10">
                <DataDisplayTableWrapper 
                    filters={filters}
                    setFilters={setFilters}
                    tabs={tabList}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    filterOptions={filterOptions}
                    showSearch={true}
                    searchPlaceholder="Search Ticket By Event Name..."
                >
                    {
                        activeTab === "upcoming" ?
                        <MyUpcomingEventsTicketsTable />
                        :
                        activeTab === "past" ?
                        <MyPastEventsTicketsTable />
                        :
                        activeTab === "cancelled" ?
                        <MyCancelledEventsTicketsTable />
                        :
                        null
                    }
                    </DataDisplayTableWrapper>
            </section>
        </main>
    )
}