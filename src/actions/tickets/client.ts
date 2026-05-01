"use server"

import { TICKET_RECEIPT_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { cacheTag } from "next/cache"

export async function getTicketReceipt(token: string | undefined, ticketId: string | number) {
    'use cache'
    cacheTag(`ticket_receipt_${ticketId}`)
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${TICKET_RECEIPT_ENDPOINT.replace("[id]", String(ticketId))}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data ?? json }
    } catch (error: any) {
        return { success: false, message: "Failed to load ticket receipt." }
    }
}
