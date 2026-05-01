"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { Button } from "../ui/button"
import BankAccountsList from "./BankAccountList"
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog"
import { DialogDescription, DialogTitle } from "../ui/dialog"
import { useAppDispatch } from "@/lib/redux/hooks"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { requestWithdrawal } from "@/actions/payout/client"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"


type LocationType = "bank"

interface Props {
    open:      boolean
    setOpen:   Dispatch<SetStateAction<boolean>>
    amount:    string
}

const content = {
    bank: {
        gradient:    "bg-brand-primary-6",
        checkColor:  "text-brand-primary-6",
        bgActive:    "bg-brand-primary-1",
        title:       "To Bank",
        subtitle:    "Withdraw to your Bank Account",
        icon:        "ph:bank-fill",
    },
}

export default function WithdrawalLocationSelector({ setOpen, open, amount }: Props) {

    const dispatch = useAppDispatch()

    const [isLoading,          setIsLoading]          = useState(true)
    const [isSubmitting,       setIsSubmitting]        = useState(false)
    const [activeTab,          setActiveTab]           = useState<LocationType>("bank")
    const [selectedAccount,    setSelectedAccount]     = useState<PaymentAccount | null>(null)

    const handleWithdrawal = async () => {
        if (!selectedAccount || !amount) return

        setIsSubmitting(true)

        const result = await requestWithdrawal({
            amount:            amount,
            payout_account_id: selectedAccount.id,
        })

        setIsSubmitting(false)

        if (result.success) {
            setOpen(false)
            dispatch(openSuccessModal({
                title:       "Withdrawal Requested",
                description: "Your withdrawal request has been submitted. Funds will be processed to your bank account shortly.",
                variant:     "success",
                autoClose:   true,
            }))
        } else {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Withdrawal Failed",
                description: result.message ?? "Something went wrong. Please try again.",
            }))
        }
    }

    const canWithdraw = !isLoading && !!selectedAccount && !!amount && !isSubmitting

    return (
        <AnimatedDialog open={open} showCloseButton={false} className="w-101">
            <div>
                <div className="text-center mb-8">
                    <DialogTitle className={cn("font-bold text-brand-secondary-9")}>
                        Select Withdrawal Location
                    </DialogTitle>
                    <DialogDescription className="text-xs text-brand-secondary-6 mt-1">
                        Choose an account to withdraw your earnings
                    </DialogDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {(Object.entries(content) as [LocationType, typeof content.bank][]).map(([key, tab]) => (
                        <div
                            key={key}
                            className={cn(
                                "p-0.5 h-fit flex-1 rounded-xl overflow-hidden transition-all hover:shadow-sm duration-300",
                                activeTab === key ? tab.gradient : "bg-brand-neutral-5"
                            )}
                        >
                            <button
                                onClick={() => setActiveTab(key)}
                                className={cn(
                                    "w-full p-2 h-14.5 rounded-[11px] flex flex-row-reverse items-center gap-3 transition-all duration-300",
                                    activeTab === key ? tab.bgActive : "bg-white"
                                )}
                            >
                                <div className="text-left flex-1">
                                    <h3 className="font-bold text-brand-secondary-9 text-xs">{tab.title}</h3>
                                    <p className="text-[10px] text-brand-secondary-6 mt-0.5">{tab.subtitle}</p>
                                </div>
                                <Icon
                                    icon="ph:seal-check-fill"
                                    width="20"
                                    height="20"
                                    className={cn(
                                        "shrink-0",
                                        activeTab === key ? tab.checkColor : "text-brand-neutral-5"
                                    )}
                                />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="min-h-35 flex flex-col gap-3">
                    {activeTab === "bank" && (
                        <BankAccountsList
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            onSelect={setSelectedAccount}
                        />
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <Button
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => setOpen(false)}
                        className="w-full h-12 md:h-14 px-6 py-4 text-sm font-medium text-brand-secondary-9 bg-white border border-brand-secondary-6 rounded-full hover:bg-neutral-100 transition-all"
                    >
                        Cancel
                    </Button>

                    <ActionButton1 
                        isDisabled={!canWithdraw}
                        action={() => handleWithdrawal()}
                        className="w-full text-sm!"
                        buttonText="Withdraw"
                        isLoading={isSubmitting}
                        buttonType="button"
                    />
                </div>
            </div>
        </AnimatedDialog>
    )
}