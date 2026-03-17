"use server"

import { PAYMENT_ACCOUNTS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"

interface GetPaymentAccountsResult {
    success:  boolean
    data?:    PaginatedResponse<PaymentAccount>
    message?: string
}

export async function getPaymentAccounts(): Promise<GetPaymentAccountsResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(PAYMENT_ACCOUNTS_ENDPOINT)
        return { success: true, data: data.data }
    } catch (error: any) {
        console.log("[getPaymentAccounts] status:", error?.response?.status)
        console.log("[getPaymentAccounts] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}