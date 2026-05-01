"use server"

import { ADD_PAYOUT_ACCOUNT_ENDPOINT, DELETE_PAYMENT_METHOD, WITHDRAWAL_REQUEST_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { randomUUID } from "crypto"

export interface BankOption {
    label: string
    value: string
    name: string
}

export interface PayoutAccount {
    id: string
    bank_name: string
    account_name: string
    account_number: string
    is_default: boolean
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
interface MutateResult {
    success: boolean
    data?: PayoutAccount
    message?: string
}

interface WithdrawalPayload {
    amount: string
    payout_account_id: string
}

interface WithdrawalResult {
    success: boolean
    message?: string
}

export async function addPayoutAccount(payload: {
    bank_name: string
    account_name: string
    account_number: string
    bank_code?: string
    is_default?: boolean
}): Promise<MutateResult> {
    const axiosInstance = await getServerAxios()
    try {
        const { data } = await axiosInstance.post(ADD_PAYOUT_ACCOUNT_ENDPOINT, payload)
        revalidateTag(CACHE_TAGS.PAYOUT_ACCOUNTS, "max")
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function deletePayoutAccount(accountId: string): Promise<{ success: boolean; message?: string }> {
    const axiosInstance = await getServerAxios()
    try {
        await axiosInstance.delete(DELETE_PAYMENT_METHOD.replace("[id]", accountId))
        revalidateTag(CACHE_TAGS.PAYOUT_ACCOUNTS, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function requestWithdrawal(payload: WithdrawalPayload): Promise<WithdrawalResult> {
    const axiosInstance = await getServerAxios()
    try {
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
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}
