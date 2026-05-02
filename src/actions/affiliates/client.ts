"use server"

import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { getServerAxios } from "@/lib/axios"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { AFFILIATE_PERFORMANCE_ENDPOINT, WITHDRAWAL_HISTORY_ENDPOINT } from "@/endpoints"

export async function revalidatePerformanceData() {
    revalidateTag(CACHE_TAGS.AFFILIATE_PERFORMANCE_WEEK, "max")
    revalidateTag(CACHE_TAGS.AFFILIATE_PERFORMANCE_MONTH, "max")
    revalidateTag(CACHE_TAGS.AFFILIATE_PERFORMANCE_YEAR, "max")
}

async function getAffiliatePerformanceSingle(filter: PerformanceFilter, year?: number) {
    const axiosInstance = await getServerAxios()
    try {
        const { data } = await axiosInstance.get(AFFILIATE_PERFORMANCE_ENDPOINT, {
            params: { filter, ...(year != null && { year }) }
        })
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
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
    const axiosInstance = await getServerAxios()
    try {
        const { data } = await axiosInstance.get(WITHDRAWAL_HISTORY_ENDPOINT, { params: { page } })
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}
