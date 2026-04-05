import { getPaymentAccounts } from "@/actions/payment"
import { getPaystackBanks } from "@/actions/payout"
import BankAccountsPageCW from "@/components/page-content-wrappers/settings/BankAccountPageCW"
import { ATTENDEE_PAGE_METADATA } from "@/metadata"
import type { Metadata } from "next"


export const metadata: Metadata = ATTENDEE_PAGE_METADATA.BANK_ACCOUNTS;


export default async function BankAccountsPage() {
    const [accountsRes, banksRes] = await Promise.all([
        getPaymentAccounts(),
        getPaystackBanks(),
    ])
    
    return (
        <BankAccountsPageCW
            initialAccounts={accountsRes.success ? (accountsRes.data?.results ?? []) : []}
            banks={banksRes.success ? (banksRes.data ?? []) : []}
        />
    )
}