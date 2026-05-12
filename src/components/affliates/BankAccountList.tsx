"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Icon } from "@iconify/react"
import { getPaymentAccountsClient } from "@/actions/payment/client"
import { BankAccountSkeleton } from "../loaders/BankListLoader"
import BankLogo from "../financials/BankLogo"





interface Props {
    onSelect?: (account: PaymentAccount) => void
    isLoading: boolean
    setIsLoading: Dispatch<SetStateAction<boolean>>
}

export default function BankAccountsList({ onSelect, isLoading, setIsLoading }: Props) {

    const [accounts, setAccounts] = useState<PaymentAccount[]>([])
    const [isError, setIsError] = useState(false)
    const [selectedId, setSelectedId] = useState<string>("")

    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            const res = await getPaymentAccountsClient()
            if (res.success && res.data) {
                setAccounts(res.data.results)
                // Pre-select default account, or first one
                const defaultAcc = res.data.results.find(a => a.is_default) ?? res.data.results[0]
                if (defaultAcc) {
                    setSelectedId(defaultAcc.id)
                    onSelect?.(defaultAcc)
                }
            } else {
                setIsError(true)
            }
            setIsLoading(false)
        }
        load()
    }, [])

    const handleSelect = (id: string) => {
        setSelectedId(id)
        const account = accounts.find(a => a.id === id)
        if (account) onSelect?.(account)
    }

    if (isLoading) return <BankAccountSkeleton />

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
            <div className="p-2 rounded-full bg-red-50">
                <Icon icon="mingcute:warning-line" className="size-5 text-red-400" />
            </div>
            <p className="text-xs font-medium text-brand-secondary-8">Could not load accounts</p>
            <p className="text-[10px] text-brand-secondary-5">Please close and try again</p>
        </div>
    )

    if (accounts.length === 0) return (
        <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
            <div className="p-2 rounded-full bg-brand-neutral-2">
                <Icon icon="ph:bank" className="size-5 text-brand-neutral-6" />
            </div>
            <p className="text-xs font-medium text-brand-secondary-8">No bank accounts added</p>
            <p className="text-[10px] text-brand-secondary-5">Add a bank account to withdraw your earnings</p>
        </div>
    )

    return (
        <RadioGroup
            value={selectedId}
            onValueChange={handleSelect}
            className="space-y-3 animate-in slide-in-from-bottom-2 duration-300"
        >
            {accounts.map(acc => (
                <Label
                    key={acc.id}
                    htmlFor={acc.id}
                    className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer",
                        "shadow-[0px_5.02px_20.08px_0px_#3326AE14]",
                        selectedId === acc.id
                            ? "border-brand-primary-4 bg-brand-primary-1/30"
                            : "border-brand-neutral-3 hover:bg-brand-primary-1/20"
                    )}
                >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-100 shrink-0 overflow-hidden">
                        <BankLogo bankName={acc.bank_name} />
                    </div>

                    <div className="flex-1 space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-brand-secondary-9 truncate">
                                {acc.account_number}
                            </h4>
                            {acc.is_default && (
                                <span className="shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-primary-1 text-brand-primary-6 border border-brand-primary-2">
                                    Default
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-brand-secondary-8 truncate">{acc.account_name}</p>
                        <p className="text-[10px] text-brand-secondary-5 truncate">{acc.bank_name}</p>
                    </div>

                    <RadioGroupItem
                        className="border-[1.5px] shrink-0"
                        value={acc.id}
                        id={acc.id}
                    />
                </Label>
            ))}
        </RadioGroup>
    )
}