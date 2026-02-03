"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { AffliatesPageFiltersNTabsData } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters";
import { affilatesMetricsConfig, howItWorksCardConfig } from "../cards/resources/metrics-config";
import { buildMetricsFromConfig } from "@/helper-fns/buildMetricsConfig";
import { cn } from "@/lib/utils";
import { space_grotesk } from "@/lib/fonts";
import AnalyticsMetricsCardsContainer from "../cards/AnalyticsMetricsCardsContainer";
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper";
import { eventsMock } from "@/mock-data";
import HowItWorksCard from "../cards/HowItWorksCard";
import AffiliateLinksTabContent from "../affliates/AffiliateLinksTabContent";
import PerformanceTabContent from "../affliates/PerformanceTabContent";
import EarningHistoryTable from "../custom-utils/TableDataDisplayAreas/tables/EarningHistoryTable";
import WithdrawalTabContent from "../affliates/WithdrawalTabContent";


export default function AffliatesPageCW() {
    const { filterOptions, tabList } = AffliatesPageFiltersNTabsData;
    const [filters, setFilters] = useState<Partial<FilterValues>>({})
    const [activeTab, setActiveTab] = useState<typeof AffliatesPageFiltersNTabsData.tabList[number]["value"]>("affiliate-links")

    const apiData = {
        'total-earnings': 612,
        'earnings-this-month': 547,
        'pending-withdrawal': 17,
        'available-to-withdraw': 5500
    }

    const analyticsMetrics = buildMetricsFromConfig(affilatesMetricsConfig, apiData)

    return (
        <main className="mt-6 pb-12">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-0">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>
                    Overview
                </h2>
            </div>

            <button className="text-brand-primary-6 font-bold text-sm mb-4 md:hidden">
                Complete Profile
            </button>

            <div>
                <AnalyticsMetricsCardsContainer metrics={analyticsMetrics} />
            </div>

            <section className="mt-10 mb-8">
                <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold md:text-lg")}>
                    How It Works
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 lg:max-w-3xl">
                    {howItWorksCardConfig.map(config => (
                        <HowItWorksCard key={config.id} config={config} />
                    ))}
                </div>
            </section>

            <section>
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
                        activeTab === "affiliate-links" ?
                        <AffiliateLinksTabContent 
                            events={eventsMock}
                            initialPageSize={3}
                        />
                        :
                        activeTab === "performance-metrics" ?
                        <PerformanceTabContent />
                        :
                        activeTab === "earnings-history" ?
                        <EarningHistoryTable />
                        :
                        activeTab === "withdrawal" ?
                        <WithdrawalTabContent />
                        :
                        null
                    }
                </DataDisplayTableWrapper>
            </section>
        </main>
    )
}