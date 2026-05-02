import {
    AFFILIATE_DASHBOARD_ENDPOINT,
    AFFILIATE_LINKS_ENDPOINT,
    AFFILIATE_EARNINGS_ENDPOINT,
    AFFILIATE_PERFORMANCE_ENDPOINT,
    WITHDRAWAL_HISTORY_ENDPOINT,
} from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"

async function _fetchPure<T>(
    endpoint: string,
    accessToken: string | undefined,
    params?: Record<string, string | number>,
): Promise<{ success: true; data: T } | { success: false; message: string }> {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`)
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v != null) url.searchParams.set(k, String(v))
            })
        }

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data ?? json }

    } catch (err: any) {
        return { success: false, message: "Request failed." }
    }
}

export async function getAffiliateDashboard(token: string | undefined) {
    return _fetchPure<AffiliateDashboardMetrics>(
        AFFILIATE_DASHBOARD_ENDPOINT,
        token
    )
}

interface GetAffiliateLinksParams {
    page?: number
    search?: string
    category?: string
    start_date?: string
    end_date?: string
}

export async function getAffiliateLinks(token: string | undefined, params: GetAffiliateLinksParams = {}) {
    return _fetchPure<PaginatedResponse<AffiliateEvent>>(
        AFFILIATE_LINKS_ENDPOINT,
        token,
        params as Record<string, string | number>,
    )
}

interface GetEarningsParams {
    page?: number
    search?: string
    category?: string
    start_date?: string
    end_date?: string
    status?: string
}

export async function getEarningsHistory(token: string | undefined, params: GetEarningsParams = {}) {
    return _fetchPure<PaginatedResponse<EarningHistoryItem>>(
        AFFILIATE_EARNINGS_ENDPOINT,
        token,
        params as Record<string, string | number>,
    )
}

export async function getAffiliatePerformanceSingle(
    token: string | undefined,
    filter: PerformanceFilter,
    year?: number,
) {
    return _fetchPure<AffiliatePerformanceData>(
        AFFILIATE_PERFORMANCE_ENDPOINT,
        token,
        { filter, ...(year != null && { year }) },
    )
}

export async function getAffiliatePerformanceAll(token: string | undefined, year: number): Promise<AllPerformanceData> {
    const [weekRes, monthRes, yearRes] = await Promise.all([
        getAffiliatePerformanceSingle(token, "week"),
        getAffiliatePerformanceSingle(token, "month"),
        getAffiliatePerformanceSingle(token, "year", year),
    ])

    return {
        week: weekRes.success ? weekRes.data as WeekPerformanceData : null,
        month: monthRes.success ? monthRes.data as MonthPerformanceData : null,
        year: yearRes.success ? yearRes.data as YearPerformanceData : null,
    }
}

export async function getWithdrawalHistory(token: string | undefined, page = 1) {
    return _fetchPure<PaginatedResponse<WithdrawalHistoryItem>>(
        WITHDRAWAL_HISTORY_ENDPOINT,
        token,
        { page },
    )
}