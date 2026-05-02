import { PAYMENT_ACCOUNTS_ENDPOINT, PAYMENT_METHODS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"

export interface GetPaymentAccountsResult {
    success: boolean
    data?: PaginatedResponse<PaymentAccount>
    message?: string
}

export interface PaymentMethodsResult {
    success: boolean
    data?: PaymentMethod[]
    message?: string
}

export async function getPaymentAccounts(token: string | undefined): Promise<GetPaymentAccountsResult> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${PAYMENT_ACCOUNTS_ENDPOINT}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }
    } catch (error: any) {
        return { success: false, message: "Failed to load payment accounts." }
    }
}

export async function getPaymentMethods(token: string | undefined): Promise<PaymentMethodsResult> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${PAYMENT_METHODS_ENDPOINT}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        const results = json.data?.results ?? json.results ?? json.data ?? json
        return { success: true, data: Array.isArray(results) ? results : [] }
    } catch (error: any) {
        return { success: false, message: "Failed to load payment methods." }
    }
}
