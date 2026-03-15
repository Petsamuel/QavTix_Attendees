"use server"

import { TICKET_RECEIPT_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"

interface GetReceiptResult {
    success:  boolean
    data?:    TicketReceipt
    message?: string
}

export async function getTicketReceipt(ticketID: string): Promise<GetReceiptResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get<TicketReceiptResponse>(
            `${TICKET_RECEIPT_ENDPOINT}`.replace("[id]", ticketID)
        )
        return { success: true, data: data.data }
    } catch (error: any) {
        return {
            success: false,
            message: handleApiError(error?.response?.data),
        }
    }
}