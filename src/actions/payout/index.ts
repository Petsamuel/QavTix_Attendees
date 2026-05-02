import { PAYOUT_ACCOUNTS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"

export interface PayoutAccount {
    id: string
    bank_name: string
    account_name: string
    account_number: string
    is_default: boolean
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

export async function getPayoutAccounts(token: string | undefined): Promise<{ success: boolean; data?: PayoutAccount[]; message?: string }> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${PAYOUT_ACCOUNTS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
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
        return { success: false, message: "Failed to load payout accounts." }
    }
}