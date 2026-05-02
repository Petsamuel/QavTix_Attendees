import { getPaymentAccounts } from "@/actions/payment"
import { getPaystackBanks } from "@/actions/payout/index"
import BankAccountsPageCW from "@/components/page-content-wrappers/settings/BankAccountPageCW"
import { ATTENDEE_PAGE_METADATA } from "@/lib/metadata"
import type { Metadata } from "next"


export const metadata: Metadata = ATTENDEE_PAGE_METADATA.BANK_ACCOUNTS;


import { cookies } from "next/headers"

export default async function BankAccountsPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const [accountsRes, banksRes] = await Promise.all([
        getPaymentAccounts(token),
        getPaystackBanks(),
    ])
    
    return (
        <BankAccountsPageCW
            initialAccounts={accountsRes.success ? (accountsRes.data?.results ?? []) : []}
            banks={banksRes.success ? (banksRes.data ?? []) : []}
        />
    )
}