import { getPaymentAccounts } from "@/actions/payment"
import { getPaystackBanks } from "@/actions/payout"
import BankAccountsPageCW from "@/components/page-content-wrappers/settings/BankAccountPageCW"

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