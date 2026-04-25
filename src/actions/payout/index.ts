"use server"

import { ADD_PAYOUT_ACCOUNT_ENDPOINT, DELETE_PAYMENT_METHOD, PAYOUT_ACCOUNTS_ENDPOINT, WITHDRAWAL_REQUEST_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"
import { randomUUID } from "crypto"

export interface PayoutAccount {
    id: string
    bank_name: string
    account_name: string
    account_number: string
    is_default: boolean
}

interface MutateResult {
    success: boolean
    data?: PayoutAccount
    message?: string
}

interface VerifyResult {
    success: boolean
    account_name?: string
    message?: string
}

export async function verifyAccountNumber(
    accountNumber: string,
    bankCode: string,
): Promise<VerifyResult> {
    try {
        const res = await fetch(
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
            {
                headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
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
    name: string
}

export async function getPaystackBanks(): Promise<{ success: boolean; data?: BankOption[]; message?: string }> {
    try {
        const res = await fetch("https://api.paystack.co/bank?country=nigeria&perPage=100", {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
            next: { revalidate: 60 * 60 * 24 },
        })
        const json = await res.json()
        if (!res.ok || !json.status) return { success: false, message: "Could not load banks" }

        const seen = new Set<string>()
        const banks: BankOption[] = []
        for (const b of json.data as any[]) {
            if (seen.has(b.code)) continue
            seen.add(b.code)
            banks.push({ label: b.name, value: b.code, name: b.name })
        }
        return { success: true, data: banks }
    } catch {
        return { success: false, message: "Could not load banks" }
    }
}

export async function getPayoutAccounts(): Promise<{ success: boolean; data?: PayoutAccount[]; message?: string }> {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${PAYOUT_ACCOUNTS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                next: { tags: [CACHE_TAGS.PAYOUT_ACCOUNTS], revalidate: 3600 },
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
        console.log("[getPayoutAccounts] error:", error)
        return { success: false, message: "Failed to load payout accounts." }
    }
}

export async function addPayoutAccount(payload: {
    bank_name: string
    account_name: string
    account_number: string
    bank_code?: string
    is_default?: boolean
}): Promise<MutateResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.post(ADD_PAYOUT_ACCOUNT_ENDPOINT, payload)
        revalidateTag(CACHE_TAGS.PAYOUT_ACCOUNTS, "max")
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
        await axiosInstance.delete(DELETE_PAYMENT_METHOD.replace("[id]", accountId))
        revalidateTag(CACHE_TAGS.PAYOUT_ACCOUNTS, "max")
        return { success: true }
    } catch (error: any) {
        console.log("[deletePayoutAccount] status:", error?.response?.status)
        console.log("[deletePayoutAccount] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}


interface WithdrawalPayload {
    amount: string
    payout_account_id: string
}

interface WithdrawalResult {
    success: boolean
    message?: string
}


export async function requestWithdrawal(payload: WithdrawalPayload): Promise<WithdrawalResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(WITHDRAWAL_REQUEST_ENDPOINT, payload, {
            headers: {
                "Idempotency-Key": randomUUID(),
            },
        })
        revalidateTag(CACHE_TAGS.AFFILIATE_EARNINGS, "max")
        revalidateTag(CACHE_TAGS.AFFILIATE_DASHBOARD, "max")
        revalidateTag(CACHE_TAGS.WITHDRAWAL_HISTORY, "max")
        return { success: true }
    } catch (error: any) {
        console.log("[requestWithdrawal] status:", error?.response?.status)
        console.log("[requestWithdrawal] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}