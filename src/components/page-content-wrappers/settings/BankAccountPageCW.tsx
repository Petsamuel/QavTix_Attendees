"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import BankAccountCard from "@/components/cards/BankAccountCard"
import AddBankAccountForm from "@/components/forms/AddBankAccountForm"
import { BankOption, PayoutAccount } from "@/actions/payout"

interface Props {
    initialAccounts: PayoutAccount[]
    banks:           BankOption[]
}

export default function BankAccountsPageCW({ initialAccounts, banks }: Props) {

    const [accounts,    setAccounts]    = useState<PayoutAccount[]>(initialAccounts)
    const [showModal,   setShowModal]   = useState(false)

    const handleAdded = (account: PayoutAccount) => {
        setAccounts(prev => [...prev, account])
    }

    const handleDeleted = (id: string) => {
        setAccounts(prev => prev.filter(a => a.id !== id))
    }

    return (
        <main className="w-full pt-8 pb-16 space-y-12">
            <div className="flex justify-between gap-10 items-center w-full">
                <h2 className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9")}>Bank Accounts</h2>
                <button
                    aria-label="Add Bank"
                    onClick={() => setShowModal(true)}
                    className="bg-brand-primary-1 text-brand-primary-6 aspect-square size-12 rounded-md p-2 flex justify-center items-center hover:bg-brand-primary-2 transition-colors"
                >
                    <Plus />
                </button>
            </div>

            {accounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <div className="p-3 rounded-full bg-brand-neutral-2">
                        <Icon icon="ph:bank" className="size-6 text-brand-neutral-6" />
                    </div>
                    <p className="text-sm font-medium text-brand-secondary-8">No bank accounts yet</p>
                    <p className="text-xs text-brand-secondary-5">Add a bank account to start withdrawing earnings.</p>
                </div>
            ) : (
                <div className="flex gap-4 gap-y-6 flex-wrap">
                    {accounts.map(account => (
                        <BankAccountCard key={account.id} account={account} onDelete={handleDeleted} />
                    ))}
                </div>
            )}

            <AddBankAccountForm
                open={showModal}
                onOpenChange={setShowModal}
                banks={banks}
                onAdded={handleAdded}
            />
        </main>
    )
}