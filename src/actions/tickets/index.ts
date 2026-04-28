"use server"

import { TICKET_RECEIPT_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"

interface GetReceiptResult {
    success:  boolean
    data?:    TicketReceipt
    message?: string
}

export async function getTicketReceipt(ticketID: string): Promise<GetReceiptResult> {
    const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${TICKET_RECEIPT_ENDPOINT.replace("[id]", ticketID)}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                next: { tags: [CACHE_TAGS.TICKET_RECEIPTS], revalidate: 3600 },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }
    } catch (error: any) {
        return {
            success: false,
            message: "Failed to load ticket receipt.",
        }
    }
}