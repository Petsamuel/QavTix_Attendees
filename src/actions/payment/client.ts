"use server"

import { ADD_PAYMENT_CARD, ADD_PAYMENT_CARD_CONFIRM, PAYMENT_METHODS_ENDPOINT, SET_DEFAULT_PAYMENT_CARD_ENDPOINT, PAYMENT_ACCOUNTS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"

interface MutateResult {
    success: boolean
    message?: string
}

interface InitializePaymentResult {
    success: boolean
    checkout_url?: string
    message?: string
}

interface VerifyPaymentPayload {
    reference: string
    save_card: boolean
    country: string
}

interface GetPaymentAccountsResult {
    success: boolean
    data?: PaginatedResponse<PaymentAccount>
    message?: string
}

interface PaymentMethodsResult {
    success: boolean
    data?: PaymentMethod[]
    message?: string
}

export async function getPaymentAccountsClient(): Promise<GetPaymentAccountsResult> {
    const axiosInstance = await getServerAxios()
    try {
        const { data } = await axiosInstance.get(PAYMENT_ACCOUNTS_ENDPOINT)
        return { success: true, data: data.data }
    } catch (error: any) {
        return { success: false, message: "Failed to load payment accounts." }
    }
}

export async function getPaymentMethodsClient(): Promise<PaymentMethodsResult> {
    const axiosInstance = await getServerAxios()
    try {
        const { data } = await axiosInstance.get(PAYMENT_METHODS_ENDPOINT)
        const results = data.data?.results ?? data.results ?? data.data ?? data
        return { success: true, data: Array.isArray(results) ? results : [] }
    } catch (error: any) {
        return { success: false, message: "Failed to load payment methods." }
    }
}

export async function setDefaultPaymentMethod(methodID: number): Promise<MutateResult> {
    const axiosInstance = await getServerAxios()
    try {
        const endpoint = SET_DEFAULT_PAYMENT_CARD_ENDPOINT.replace("[card_id]", String(methodID))
        await axiosInstance.patch(endpoint)
        revalidateTag(CACHE_TAGS.PAYMENT_METHODS, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function deletePaymentMethod(methodId: number): Promise<MutateResult> {
    const axiosInstance = await getServerAxios()
    try {
        await axiosInstance.delete(`${PAYMENT_METHODS_ENDPOINT}/${methodId}/`)
        revalidateTag(CACHE_TAGS.PAYMENT_METHODS, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function addPaymentMethod(country: string): Promise<InitializePaymentResult> {
    const axiosInstance = await getServerAxios()
    try {
        const { data: json } = await axiosInstance.post(ADD_PAYMENT_CARD, { country, currency: "NGN" })
        const checkout_url = json.data?.checkout_url ?? json.checkout_url
        if (!checkout_url) return { success: false, message: "No checkout URL returned from server." }
        return { success: true, checkout_url }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function verifyPaymentMethod(
    payload: VerifyPaymentPayload
): Promise<{ message: string, success: boolean }> {
    const axiosInstance = await getServerAxios()
    try {
        await axiosInstance.post(ADD_PAYMENT_CARD_CONFIRM, payload)
        revalidateTag(CACHE_TAGS.PAYMENT_METHODS, "max")
        return { success: true, message: "Confirmation Successful" }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}
