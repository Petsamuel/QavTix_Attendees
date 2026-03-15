"use server"

import { RESELL_TICKET_ENDPOINT, TRANSFER_TICKET_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"

interface TransferTicketPayload {
    ticket_id:       string
    recipient_email: string
}

interface TransferTicketResult {
    success: boolean
    message: string
}

interface ResellTicketPayload {
    ticket_id: string
    price:     string
}

interface ResellTicketResult {
    success: boolean
    message: string
}


export async function transferTicket(payload: TransferTicketPayload): Promise<TransferTicketResult> {
    
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.post(TRANSFER_TICKET_ENDPOINT, payload)

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
        const api      = await getServerAxios()
        const { data } = await api.post(RESELL_TICKET_ENDPOINT, payload)

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