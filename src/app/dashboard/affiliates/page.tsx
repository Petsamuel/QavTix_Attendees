import AffliatesPageCW from "@/components/page-content-wrappers/AffliatesPageCW"
import {
    getAffiliateDashboard,
    getAffiliateLinks,
    getEarningsHistory,
    getAffiliatePerformanceAll,
    getWithdrawalHistory,
} from "@/actions/affiliates"
import { ApiCategory, getCategories } from "@/actions/filters"
import { ATTENDEE_PAGE_METADATA } from "@/metadata"
import type { Metadata } from "next"


export const metadata: Metadata = ATTENDEE_PAGE_METADATA.AFFILIATES;



const emptySlice = { results: [], count: 0, next: null, previous: null, total_pages: 1 }

async function getAffiliateData() {
    const currentYear = new Date().getFullYear()

    const [dashboardRes, linksRes, earningsRes, performanceData, categoriesRes, withdrawalHistoryRes] = await Promise.all([
        getAffiliateDashboard(),
        getAffiliateLinks({ page: 1 }),
        getEarningsHistory({ page: 1 }),
        getAffiliatePerformanceAll(currentYear),
        getCategories(),
        getWithdrawalHistory(),
    ])

    return {
        metrics:         dashboardRes.success ? dashboardRes.data as AffiliateDashboardMetrics : null,
        affiliateLinks:  linksRes.success     ? linksRes.data    as PaginatedResponse<AffiliateEvent>     : emptySlice,
        earningsHistory: earningsRes.success  ? earningsRes.data as PaginatedResponse<EarningHistoryItem> : emptySlice,
        performance:     performanceData,
        categories:     categoriesRes.success ? categoriesRes.data as ApiCategory[] : [],
        withdrawalHistory: withdrawalHistoryRes.success ? withdrawalHistoryRes.data as PaginatedResponse<WithdrawalHistoryItem> : emptySlice
    }
}

export default async function AffiliatePage() {
    const data = await getAffiliateData()

    return (
        <AffliatesPageCW
            metrics={data.metrics}
            affiliateLinks={data.affiliateLinks}
            earningsHistory={data.earningsHistory}
            performance={data.performance}
            categories={data.categories}
            withdrawalHistory={data.withdrawalHistory}
        />
    )
}