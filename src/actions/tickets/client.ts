"use server"

import { TICKET_RECEIPT_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { cacheTag } from "next/cache"

export async function getTicketReceipt(ticketId: string | number) {
    const axiosInstance = await getServerAxios()
    try {
        const { data } = await axiosInstance.get(TICKET_RECEIPT_ENDPOINT.replace("[id]", String(ticketId)))
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}
