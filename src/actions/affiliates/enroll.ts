"use server"

import { AFFILIATE_ENROLL_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { handleApiError } from "@/helper-fns/handleApiErrors"

export interface AffiliateEnrollResponse {
    id: number
    event: string
    code: string
    link: string
    clicks: number
    sales: number
}

export async function generateAffiliateLink(eventId: string) {
    const axiosInstance = await getServerAxios()
    try {
        const { data } = await axiosInstance.post(AFFILIATE_ENROLL_ENDPOINT, { event_id: eventId })
        return { success: true, data: data.data ?? data as AffiliateEnrollResponse }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}
