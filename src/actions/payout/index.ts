"use server"

import { PAYOUT_ACCOUNTS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"

export interface PayoutAccount {
    id:             string
    bank_name:      string
    account_name:   string
    account_number: string
    is_default:     boolean
}

interface PayoutResult {
    success:  boolean
    data?:    PayoutAccount[]
    message?: string
}

interface MutateResult {
    success:  boolean
    data?:    PayoutAccount
    message?: string
}

interface VerifyResult {
    success:      boolean
    account_name?: string
    message?:     string
}


export async function verifyAccountNumber(
    accountNumber: string,
    bankCode:      string,
): Promise<VerifyResult> {
    try {
        const res = await fetch(
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
                cache: "no-store",
            }
        )

        const json = await res.json()

        if (!res.ok || !json.status) {
            return { success: false, message: json.message ?? "Could not verify account" }
        }

        return { success: true, account_name: json.data.account_name }
    } catch {
        return { success: false, message: "Verification failed. Please try again." }
    }
}


export interface BankOption {
    label: string
    value: string
    name:  string
}

export async function getPaystackBanks(): Promise<{ success: boolean; data?: BankOption[]; message?: string }> {
    try {
        const res  = await fetch("https://api.paystack.co/bank?country=nigeria&perPage=100", {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
            next:    { revalidate: 60 * 60 * 24 },
        })
        const json = await res.json()
        if (!res.ok || !json.status) return { success: false, message: "Could not load banks" }

        const seen  = new Set<string>()
        const banks: BankOption[] = []

        for (const b of json.data as any[]) {
            if (seen.has(b.code)) continue
            seen.add(b.code)
            banks.push({
                label: b.name,
                value: b.code,
                name:  b.name,
            })
        }

        return { success: true, data: banks }
    } catch {
        return { success: false, message: "Could not load banks" }
    }
}


export async function addPayoutAccount(payload: {
    bank_name:      string
    account_name:   string
    account_number: string
    is_default?:    boolean
}): Promise<MutateResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.post(PAYOUT_ACCOUNTS_ENDPOINT, payload)
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        console.log("[addPayoutAccount] status:", error?.response?.status)
        console.log("[addPayoutAccount] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}


export async function deletePayoutAccount(accountId: string): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.delete(`${PAYOUT_ACCOUNTS_ENDPOINT}/${accountId}`)
        return { success: true }
    } catch (error: any) {
        console.log("[deletePayoutAccount] status:", error?.response?.status)
        console.log("[deletePayoutAccount] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}