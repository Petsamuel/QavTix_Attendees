"use server"

import { CACHE_TAGS } from "@/cache-tags"
import { MARKETPLACE_DELIST_ENDPOINT, MARKETPLACE_LIST_ENDPOINT, RESELL_TICKET_ENDPOINT, TRANSFER_TICKET_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

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


export async function transferTicket(payload: TransferTicketPayload): Promise<TransferTicketResult> {

    try {
        const axiosInstance = await getServerAxios()
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
    try {
        const api = await getServerAxios()
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






interface GetMarketplaceParams {
    page?: number
    search?: string
    category?: string
    start_date?: string
    end_date?: string
    min_price?: string
    max_price?: string
}

interface GetMarketplaceResult {
    success: boolean
    data?: PaginatedResponse<MarketplaceEvent>
    message?: string
}


interface MutateMarketplaceResult {
    success: boolean
    message?: string
}

export async function getMarketplace(params: GetMarketplaceParams = {}): Promise<GetMarketplaceResult> {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${MARKETPLACE_LIST_ENDPOINT}`)
        Object.entries(params).forEach(([k, v]) => {
            if (v != null) url.searchParams.set(k, String(v))
        })

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
            next: { tags: [CACHE_TAGS.EVENT_CARDS, CACHE_TAGS.MARKETPLACE], revalidate: 3000 },
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (error: any) {
        return { success: false, message: "Failed to load marketplace." }
    }
}




export async function delistTicket(eventID: string | number): Promise<MutateMarketplaceResult> {
    try {
        const axiosInstance = await getServerAxios()
        const endpoint = MARKETPLACE_DELIST_ENDPOINT.replace("[event_id]", String(eventID))
        await axiosInstance.delete(endpoint)
        revalidateTag(CACHE_TAGS.MARKETPLACE, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}