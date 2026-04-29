"use server"

import { CACHE_TAGS } from "@/cache-tags"
import {
    AFFILIATE_DASHBOARD_ENDPOINT,
    AFFILIATE_LINKS_ENDPOINT,
    AFFILIATE_EARNINGS_ENDPOINT,
    AFFILIATE_PERFORMANCE_ENDPOINT,
    WITHDRAWAL_HISTORY_ENDPOINT,
} from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { cookies } from "next/headers"
import { revalidateTag, cacheTag } from "next/cache"

async function fetchWithTag<T>(
    endpoint: string,
    tag: string,
    params?: Record<string, string | number>,
): Promise<{ success: true; data: T } | { success: false; message: string }> {
    const accessToken = (await cookies()).get("access_token")?.value
    return _fetchWithTag(endpoint, tag, params, accessToken)
}

async function _fetchWithTag<T>(
    endpoint: string,
    tag: string,
    params: Record<string, string | number> | undefined,
    accessToken: string | undefined
): Promise<{ success: true; data: T } | { success: false; message: string }> {
    "use cache"
    cacheTag(tag)
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
            console.log(`[${tag}] status:`, res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data ?? json }

    } catch (err: any) {
        console.log(`[${tag}] error:`, err?.message)
        return { success: false, message: "Request failed." }
    }
}

export async function getAffiliateDashboard() {
    return fetchWithTag<AffiliateDashboardMetrics>(
        AFFILIATE_DASHBOARD_ENDPOINT,
        CACHE_TAGS.AFFILIATE_DASHBOARD,
    )
}

interface GetAffiliateLinksParams {
    page?: number
    search?: string
    category?: string
    start_date?: string
    end_date?: string
}

export async function getAffiliateLinks(params: GetAffiliateLinksParams = {}) {
    return fetchWithTag<PaginatedResponse<AffiliateEvent>>(
        AFFILIATE_LINKS_ENDPOINT,
        CACHE_TAGS.AFFILIATE_LINKS,
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

export async function getEarningsHistory(params: GetEarningsParams = {}) {
    return fetchWithTag<PaginatedResponse<EarningHistoryItem>>(
        AFFILIATE_EARNINGS_ENDPOINT,
        CACHE_TAGS.AFFILIATE_EARNINGS,
        params as Record<string, string | number>,
    )
}




// Each filter gets its own tag — prevents Next.js fetch deduplication
// from returning the same cached response for all three

export async function getAffiliatePerformanceSingle(
    filter: PerformanceFilter,
    year?: number,
) {
    const tagMap: Record<PerformanceFilter, string> = {
        week: CACHE_TAGS.AFFILIATE_PERFORMANCE_WEEK,
        month: CACHE_TAGS.AFFILIATE_PERFORMANCE_MONTH,
        year: CACHE_TAGS.AFFILIATE_PERFORMANCE_YEAR,
    }

    return fetchWithTag<AffiliatePerformanceData>(
        AFFILIATE_PERFORMANCE_ENDPOINT,
        tagMap[filter],
        { filter, ...(year != null && { year }) },
    )
}

export async function getAffiliatePerformanceAll(year: number): Promise<AllPerformanceData> {
    const [weekRes, monthRes, yearRes] = await Promise.all([
        getAffiliatePerformanceSingle("week"),
        getAffiliatePerformanceSingle("month"),
        getAffiliatePerformanceSingle("year", year),
    ])

    return {
        week: weekRes.success ? weekRes.data as WeekPerformanceData : null,
        month: monthRes.success ? monthRes.data as MonthPerformanceData : null,
        year: yearRes.success ? yearRes.data as YearPerformanceData : null,
    }
}



export async function getWithdrawalHistory(page = 1) {
    return fetchWithTag<PaginatedResponse<WithdrawalHistoryItem>>(
        WITHDRAWAL_HISTORY_ENDPOINT,
        CACHE_TAGS.WITHDRAWAL_HISTORY,
        { page },
    )
}




export async function revalidatePerformanceData() {
    revalidateTag(CACHE_TAGS.AFFILIATE_PERFORMANCE_WEEK, "max")
    revalidateTag(CACHE_TAGS.AFFILIATE_PERFORMANCE_MONTH, "max")
    revalidateTag(CACHE_TAGS.AFFILIATE_PERFORMANCE_YEAR, "max")
}