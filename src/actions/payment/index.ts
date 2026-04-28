"use server"

import { ADD_PAYMENT_CARD, ADD_PAYMENT_CARD_CONFIRM, PAYMENT_ACCOUNTS_ENDPOINT, PAYMENT_METHODS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"

interface GetPaymentAccountsResult {
    success:  boolean
    data?:    PaginatedResponse<PaymentAccount>
    message?: string
}

export async function getPaymentAccounts(): Promise<GetPaymentAccountsResult> {
    const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${PAYMENT_ACCOUNTS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                next: { tags: [CACHE_TAGS.PAYMENT_ACCOUNTS], revalidate: 3600 },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (error: any) {
        console.log("[getPaymentAccounts] error:", error)
        return { success: false, message: "Failed to load payment accounts." }
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
    const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${PAYMENT_METHODS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                next: { tags: [CACHE_TAGS.PAYMENT_METHODS], revalidate: 3600 },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        const results = json.data?.results ?? json.results ?? json.data ?? json
        return { success: true, data: Array.isArray(results) ? results : [] }

    } catch (error: any) {
        console.log("[getPaymentMethods] error:", error)
        return { success: false, message: "Failed to load payment methods." }
    }
}

export async function setDefaultPaymentMethod(methodID: number): Promise<MutateResult> {
    const axiosInstance = await getServerAxios()
try {
        await axiosInstance.patch(`${PAYMENT_METHODS_ENDPOINT}/${methodID}/default/`)
        revalidateTag(CACHE_TAGS.PAYMENT_METHODS, "max")
        return { success: true }
    } catch (error: any) {
        console.log("[setDefaultPaymentMethod] status:", error?.response?.status)
        console.log("[setDefaultPaymentMethod] body:", JSON.stringify(error?.response?.data))
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
        console.log("[deletePaymentMethod] status:", error?.response?.status)
        console.log("[deletePaymentMethod] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}




interface InitializePaymentResult {
    success:      boolean
    checkout_url?: string
    message?:     string
}

interface VerifyPaymentPayload {
    reference: string
    save_card: boolean
    country:   string
}

export async function addPaymentMethod(country: string): Promise<InitializePaymentResult> {
    const axiosInstance = await getServerAxios()
try {
        const { data: json } = await axiosInstance.post(ADD_PAYMENT_CARD, { country, currency: "naira" })
        const checkout_url = json.data?.checkout_url ?? json.checkout_url
        if (!checkout_url) {
            return { success: false, message: "No checkout URL returned from server." }
        }

        return { success: true, checkout_url }
    } catch (error: any) {
        console.log("[addPaymentMethod] status:", error?.response?.status)
        console.log("[addPaymentMethod] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}


export async function verifyPaymentMethod(
    payload: VerifyPaymentPayload
): Promise<{ message: string, success: boolean }> {
    const axiosInstance = await getServerAxios()
try {
        await axiosInstance.post(ADD_PAYMENT_CARD_CONFIRM, payload)
        return { success: true, message: "Confirmation Successful" }

    } catch (error: any) {
        console.log("[verifyPayment] status:", error?.response?.status)
        console.log("[verifyPayment] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}