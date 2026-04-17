"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { PayoutAccount, deletePayoutAccount } from "@/actions/payout"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import BankLogo from "../financials/BankLogo"

interface Props {
    account:  PayoutAccount
    onDelete: (id: string) => void
}


export default function BankAccountCard({ account, onDelete }: Props) {

    const dispatch     = useAppDispatch()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (isDeleting) return
        setIsDeleting(true)

        const result = await deletePayoutAccount(account.id)

        if (result.success) {
            onDelete(account.id)
            dispatch(showAlert({
                variant:     "default",
                title:       "Account removed",
                description: `${account.bank_name} ···· ${account.account_number.slice(-4)} has been removed.`,
            }))
        } else {
            setIsDeleting(false)
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Could not remove account",
                description: result.message ?? "Please try again.",
            }))
        }
    }

    return (
        <div className={cn(
            "w-full sm:w-75",
            "flex flex-col gap-4 p-6",
            "bg-white rounded-2xl border border-gray-100",
            "shadow-[0px_6px_24px_rgba(51,38,174,0.08)]",
            "transition-all duration-300 ease-out",
            "hover:shadow-[0px_12px_32px_rgba(51,38,174,0.12)]",
            "hover:-translate-y-1 hover:scale-[1.02]",
            "focus-within:ring-2 focus-within:ring-brand-primary-6/20",
            isDeleting && "opacity-50 pointer-events-none"
        )}>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded-md overflow-hidden shrink-0 border border-gray-100 bg-white flex items-center justify-center">
                        <BankLogo bankName={account.bank_name} />
                    </div>
                    <p className="text-xs md:text-sm font-medium text-brand-secondary-9">
                        {account.bank_name}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label="Remove account"
                    className="p-1.5 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                    {isDeleting
                        ? <Icon icon="eos-icons:three-dots-loading" className="size-8" />
                        : <Icon icon="fluent:delete-24-regular" className="size-5" />
                    }
                </button>
            </div>

            {/* Account number */}
            <h2 className={cn(
                space_grotesk.className,
                "text-2xl md:text-[30px] font-medium text-brand-secondary-9 tracking-wide"
            )}>
                {account.account_number}
            </h2>

            {/* Account holder */}
            <div className="flex items-center gap-2">
                <Icon icon="bxs:user" width="24" height="24" className="text-brand-primary-4 shrink-0" />
                <p className="text-xs text-brand-secondary-5 md:text-sm truncate">
                    {account.account_name}
                </p>
            </div>

            {/* Default badge */}
            {account.is_default && (
                <Badge className="w-fit text-[10px] bg-brand-primary-1 text-brand-primary-6 border border-brand-primary-2 shadow-none px-2 py-0.5 rounded-full font-semibold">
                    Default
                </Badge>
            )}
        </div>
    )
}