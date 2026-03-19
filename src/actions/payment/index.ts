"use server"

import { PAYMENT_ACCOUNTS_ENDPOINT, PAYMENT_METHODS_ENDPOINT } from "@/endpoints"
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


interface PaymentMethodsResult {
    success:  boolean
    data?:    PaymentMethod[]
    message?: string
}

interface MutateResult {
    success:  boolean
    message?: string
}

export async function getPaymentMethods(): Promise<PaymentMethodsResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(PAYMENT_METHODS_ENDPOINT)
        const results = data.data?.results ?? data.results ?? data.data ?? data
        return { success: true, data: Array.isArray(results) ? results : [] }
    } catch (error: any) {
        console.log("[getPaymentMethods] status:", error?.response?.status)
        console.log("[getPaymentMethods] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function setDefaultPaymentMethod(methodID: number): Promise<MutateResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.patch(`${PAYMENT_METHODS_ENDPOINT}/${methodID}/default/`)
        return { success: true }
    } catch (error: any) {
        console.log("[setDefaultPaymentMethod] status:", error?.response?.status)
        console.log("[setDefaultPaymentMethod] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function deletePaymentMethod(methodId: number): Promise<MutateResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.delete(`${PAYMENT_METHODS_ENDPOINT}/${methodId}/`)
        return { success: true }
    } catch (error: any) {
        console.log("[deletePaymentMethod] status:", error?.response?.status)
        console.log("[deletePaymentMethod] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}