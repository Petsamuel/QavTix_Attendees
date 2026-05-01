"use client"

import { Dispatch, SetStateAction, useMemo, useState } from "react"
import { AffliatesPageFiltersNTabsData } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import { affilatesMetricsConfig, howItWorksCardConfig } from "../cards/resources/metrics-config"
import { buildMetricsFromConfig } from "@/helper-fns/buildMetricsConfig"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import AnalyticsMetricsCardsContainer from "../cards/AnalyticsMetricsCardsContainer"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import HowItWorksCard from "../cards/HowItWorksCard"
import AffiliateLinksTabContent from "../affliates/AffiliateLinksTabContent"
import PerformanceTabContent from "../affliates/PerformanceTabContent"
import EarningHistoryTable from "../custom-utils/TableDataDisplayAreas/tables/EarningHistoryTable"
import WithdrawalTabContent from "../affliates/WithdrawalTabContent"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import { AFFILIATE_EARNINGS_ENDPOINT, AFFILIATE_LINKS_ENDPOINT } from "@/endpoints"
import { useAppSelector } from "@/lib/redux/hooks"
import { ApiCategory } from "@/actions/filters/index"
import { deriveCategories } from "@/helper-fns/deriveCategories"
import { PLATFORM_CURRENCY } from "@/components-data/currencies"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"

interface Props {
    metrics:           AffiliateDashboardMetrics | null
    affiliateLinks:    TabSlice<AffiliateEvent>
    earningsHistory:   TabSlice<EarningHistoryItem>
    performance:       AllPerformanceData
    categories:        ApiCategory[]
    withdrawalHistory: PaginatedResponse<WithdrawalHistoryItem>
}

export default function AffliatesPageCW({ metrics, affiliateLinks, earningsHistory, categories, performance, withdrawalHistory }: Props) {

    const { filterOptions, tabList } = AffliatesPageFiltersNTabsData
    const [filters,   setFilters]   = useState<Partial<FilterValues>>({})
    const [activeTab, setActiveTab] = useState<typeof tabList[number]["value"]>("affiliate-links")
    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()

    const currency = isMounted
        ? (user?.currency || PLATFORM_CURRENCY)
        : PLATFORM_CURRENCY

    const { activeTabState: linksState } = useDataDisplay<AffiliateEvent>(
        {
            endpoint: AFFILIATE_LINKS_ENDPOINT,
            tabs: [{ key: "affiliate-links", initialData: affiliateLinks, staticParams: {} }],
            activeTab: "affiliate-links",
        },
        filters,
    )
    
    const { activeTabState: earningsState } = useDataDisplay<EarningHistoryItem>(
        {
            endpoint: AFFILIATE_EARNINGS_ENDPOINT,
            tabs: [{ key: "earnings-history", initialData: earningsHistory, staticParams: {} }],
            activeTab: "earnings-history",
        },
        filters,
    )

    const availableCategories = useMemo(
        () => deriveCategories(categories, activeTab === "affiliate-links" ? linksState.cachedItems : earningsState.cachedItems),
        [categories, linksState.cachedItems, earningsState.cachedItems]
    )
    
    const apiData = {
        "total-earnings":        metrics?.total_earnings        ?? 0,
        "earnings-this-month":   metrics?.earnings_this_month   ?? 0,
        "pending-withdrawal":    metrics?.pending_withdrawals    ?? 0,
        "available-to-withdraw": metrics?.available_to_withdraw ?? 0,
    }

    const analyticsMetrics = buildMetricsFromConfig(affilatesMetricsConfig, apiData, currency)

    const activeSearchHandler =
        activeTab === "affiliate-links"  ? linksState.handleSearch   :
        activeTab === "earnings-history" ? earningsState.handleSearch :
        undefined

    const isActiveTabLoading =
        activeTab === "affiliate-links"  ? linksState.isLoading   :
        activeTab === "earnings-history" ? earningsState.isLoading :
        false

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

            <AnalyticsMetricsCardsContainer metrics={analyticsMetrics} />

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
                    filters={(activeTab !== "withdrawal" && activeTab !== "performance-metrics") ? filters : undefined}
                    setFilters={setFilters}
                    tabs={tabList}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    filterOptions={(activeTab !== "withdrawal" && activeTab !== "performance-metrics") ? filterOptions : undefined}
                    showSearch={activeTab !== "withdrawal" && activeTab !== "performance-metrics"}
                    categories={availableCategories}
                    searchPlaceholder="Search Events..."
                    onSearch={activeSearchHandler}
                    isLoading={isActiveTabLoading}
                >
                    {activeTab === "affiliate-links" && (
                        <AffiliateLinksTabContent
                            items={linksState.items}
                            isLoading={linksState.isLoading}
                            isLoadingMore={linksState.isLoadingMore}
                            hasNext={linksState.hasNext}
                            count={linksState.count}
                            onLoadMore={linksState.loadMore}
                            isEmpty={linksState.isEmpty}
                            isError={linksState.isError}
                            search={linksState.search}
                        />
                    )}

                    {activeTab === "performance-metrics" && (
                        <PerformanceTabContent initialData={performance} />
                    )}

                    {activeTab === "earnings-history" && (
                        <EarningHistoryTable
                            items={earningsState.items}
                            isLoading={earningsState.isLoading}
                            isLoadingMore={earningsState.isLoadingMore}
                            hasNext={earningsState.hasNext}
                            count={earningsState.count}
                            onLoadMore={earningsState.loadMore}
                            isEmpty={earningsState.isEmpty}
                            isError={earningsState.isError}
                            search={earningsState.search}
                        />
                    )}

                    {activeTab === "withdrawal" && (
                        <WithdrawalTabContent income_this_week={metrics?.earnings_this_week} account_balance={metrics?.available_to_withdraw} withdrawalHistory={withdrawalHistory} />
                    )}
                </DataDisplayTableWrapper>
            </section>
        </main>
    )
}