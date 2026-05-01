"use server"

import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { getAuthToken } from "@/helper-fns/getAuthToken"
import { 
    getAffiliatePerformanceAll as getAffiliatePerformanceAllServer,
    getWithdrawalHistory as getWithdrawalHistoryServer
} from "./index"

export async function revalidatePerformanceData() {
    revalidateTag(CACHE_TAGS.AFFILIATE_PERFORMANCE_WEEK, "max")
    revalidateTag(CACHE_TAGS.AFFILIATE_PERFORMANCE_MONTH, "max")
    revalidateTag(CACHE_TAGS.AFFILIATE_PERFORMANCE_YEAR, "max")
}

export async function getAffiliatePerformanceAll(year: number) {
    const token = await getAuthToken()
    return getAffiliatePerformanceAllServer(token, year)
}

export async function getWithdrawalHistory(page = 1) {
    const token = await getAuthToken()
    return getWithdrawalHistoryServer(token, page)
}
