"use server"

import { CACHE_TAGS } from "@/cache-tags"
import { MARKETPLACE_DELIST_ENDPOINT, RESELL_TICKET_ENDPOINT, TRANSFER_TICKET_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"

interface TransferTicketPayload {
    ticket_id: string
    recipient_email: string
}

interface TransferTicketResult {
    success: boolean
    message: string
}

interface ResellTicketPayload {
    ticket_id: string
    price: string
}

interface ResellTicketResult {
    success: boolean
    message: string
}

interface MutateMarketplaceResult {
    success: boolean
    message?: string
}

export async function transferTicket(payload: TransferTicketPayload): Promise<TransferTicketResult> {
    const axiosInstance = await getServerAxios()

    try {
        const { data } = await axiosInstance.post(TRANSFER_TICKET_ENDPOINT, payload)
        revalidateTag(CACHE_TAGS.MARKETPLACE, "max")
        return {
            success: true,
            message: data.message ?? "Ticket transferred successfully",
        }
    } catch (error: any) {
        return {
            success: false,
            message: handleApiError(error?.response?.data),
        }
    }
}

export async function resellTicket(payload: ResellTicketPayload): Promise<ResellTicketResult> {
    const api = await getServerAxios()
    try {
        const { data } = await api.post(RESELL_TICKET_ENDPOINT, payload)
        revalidateTag(CACHE_TAGS.MARKETPLACE, "max")
        return {
            success: true,
            message: data.message ?? "Ticket listed successfully",
        }
    } catch (error: any) {
        return {
            success: false,
            message: handleApiError(error?.response?.data),
        }
    }
}

export async function delistTicket(eventID: string | number): Promise<MutateMarketplaceResult> {
    const axiosInstance = await getServerAxios()
    try {
        const endpoint = MARKETPLACE_DELIST_ENDPOINT.replace("[event_id]", String(eventID))
        await axiosInstance.delete(endpoint)
        revalidateTag(CACHE_TAGS.MARKETPLACE, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}
