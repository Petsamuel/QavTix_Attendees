"use client"

import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { Icon } from "@iconify/react"
import { Button } from "../ui/button"
import { ChangeEvent, useState } from "react"
import WithdrawalHistoryTable from "../custom-utils/TableDataDisplayAreas/tables/WithdrawalHistoryTable"
import WithdrawalLocationSelector from "./WithdrawalLocationSelector"
import { useFormatPrice } from "@/custom-hooks/UseFormatPrice"
import { useAppSelector } from "@/lib/redux/hooks"
import { getCurrencySymbol, MIN_WITHDRAWAL } from "@/components-data/currencies"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"

interface Props {
    account_balance?: number
    income_this_week?: number
    withdrawalHistory: PaginatedResponse<WithdrawalHistoryItem>
}

export default function WithdrawalTabContent({ account_balance, income_this_week, withdrawalHistory }: Props) {

    const [showHistory, setShowHistory] = useState(true)
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
    const [amount, setAmount] = useState("")
    const { user } = useAppSelector(store => store.authUser)
    const format = useFormatPrice()
    const isMounted = useIsMounted()

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value.replace(/[^0-9]/g, ""))
    }

    return (
        <section className="mt-10 flex flex-col lg:flex-row gap-10 items-start">

            <div className="max-w-full w-150 mx-auto lg:mx-0 lg:w-98 shrink-0">
                <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold md:text-lg")}>
                    Available Balance
                </h3>

                <div className="w-full p-5 mt-6 shadow-[0px_5px_20px_0px_#3326AE14] bg-white rounded-lg border border-brand-neutral-2">
                    <div className="text-[11px] flex justify-between items-center">
                        <span className="text-brand-secondary-8">Amount in Naira</span>
                        {
                            income_this_week ?
                                <span className="text-[#5F9F7D] font-medium">{`+${income_this_week} This Week`}</span>
                                :
                                null
                        }
                    </div>

                    <strong className={cn(space_grotesk.className, "block my-3 text-brand-secondary-8 font-bold text-2xl md:text-[40px]")}>
                        {account_balance != null ? format(account_balance, user?.currency) : "---"}
                    </strong>

                    <Badge className="bg-brand-accent-1 text-brand-accent-7 font-medium py-1 px-2 rounded-sm text-xs border-[0.86px] border-brand-accent-2 shadow-none">
                        Minimum Withdrawal: {format(MIN_WITHDRAWAL[user?.currency as keyof typeof MIN_WITHDRAWAL] || 10000, user?.currency)}
                    </Badge>
                </div>

                <div className="mt-8 px-1">
                    <label htmlFor="withdrawal-amount" className="mb-2 block text-xs text-brand-secondary-9 font-semibold">
                        Enter amount to withdraw
                    </label>
                    <div className="mb-6 rounded-md px-3 items-center h-12 bg-[#F2F2F2] flex gap-2 border-[1.5px] border-transparent focus-within:border-brand-primary-4 hover:border-brand-primary-4 transition-all">
                        <span className="text-brand-secondary-7 text-sm font-semibold shrink-0">
                            {isMounted && getCurrencySymbol(user?.currency)}
                        </span>
                        <input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            id="withdrawal-amount"
                            placeholder="0.00"
                            className="flex-1 text-sm text-gray-700 placeholder:text-brand-secondary-3 border-s border-brand-secondary-3 ps-2 outline-none bg-transparent"
                        />
                    </div>
                    <Button
                        onClick={() => setShowWithdrawalModal(true)}
                        disabled={!amount}
                        className="h-12 bg-brand-primary-6 hover:bg-brand-primary-7 text-white shadow-sm w-full font-semibold"
                    >
                        Withdraw {amount ? `${format(Number(amount), user?.currency)}` : ""}
                    </Button>
                </div>
            </div>

            <div className="flex-1 w-full overflow-hidden mt-8 lg:mt-0">
                <div className="flex justify-between items-center mb-6">
                    <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold md:text-lg")}>
                        Withdrawal History
                    </h3>

                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        aria-label={showHistory ? "Hide withdrawal history" : "Show withdrawal history"}
                        className="lg:hidden p-2 rounded-full hover:bg-brand-neutral-2 transition-colors"
                    >
                        <Icon
                            icon="tabler:chevron-down"
                            className={cn(
                                "text-brand-secondary-8 text-xl transition-transform duration-300",
                                showHistory && "-rotate-180"
                            )}
                        />
                    </button>
                </div>

                <div className={cn(
                    "grid transition-all duration-500 ease-in-out lg:grid-rows-[1fr]",
                    showHistory ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}>
                    <div className="overflow-hidden">
                        <WithdrawalHistoryTable initialData={withdrawalHistory} />
                    </div>
                </div>
            </div>

            <WithdrawalLocationSelector amount={amount} open={showWithdrawalModal} setOpen={setShowWithdrawalModal} />
        </section>
    )
}