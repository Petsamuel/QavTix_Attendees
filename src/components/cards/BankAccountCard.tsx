"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { PayoutAccount, deletePayoutAccount } from "@/actions/payout"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { getBankLogoUrl } from "@/helper-fns/bankLogos"

interface Props {
    account:  PayoutAccount
    onDelete: (id: string) => void
}

const BankLogo = ({ bankName }: { bankName: string }) => {
    const logoUrl = getBankLogoUrl(bankName)
    const [imgError, setImgError] = useState(false)

    if (!logoUrl || imgError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-brand-neutral-2">
                <Icon icon="ph:bank-fill" className="size-5 text-brand-neutral-6" />
            </div>
        )
    }

    return (
        <Image
            src={logoUrl}
            width={40}
            height={40}
            alt={bankName}
            className="object-contain w-full h-full"
            onError={() => setImgError(true)}
        />
    )
}



export default function BankAccountCard({ account, onDelete }: Props) {

    const dispatch    = useAppDispatch()
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
            "bg-white shadow-[0px_5.8px_23.17px_0px_#3326AE14] rounded-2xl p-5 border border-gray-100 flex flex-col gap-3 w-full max-w-[18rem] transition-opacity",
            isDeleting && "opacity-50 pointer-events-none"
        )}>
            <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-100 shrink-0 overflow-hidden">
                    <BankLogo bankName={account.bank_name} />
                </div>

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label="Remove account"
                    className="p-2 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                    {isDeleting
                        ? <Icon icon="eos-icons:three-dots-loading" className="size-5" />
                        : <Icon icon="heroicons:trash" className="size-4" />
                    }
                </button>
            </div>

            <div className="space-y-0.5">
                <p className="text-sm font-bold text-brand-secondary-9">{account.account_number}</p>
                <p className="text-xs text-brand-secondary-7">{account.account_name}</p>
                <p className="text-[11px] text-brand-secondary-5">{account.bank_name}</p>
            </div>

            {account.is_default && (
                <Badge className="w-fit text-[10px] bg-brand-primary-1 text-brand-primary-6 border border-brand-primary-2 shadow-none px-2 py-0.5 rounded-full font-semibold">
                    Default
                </Badge>
            )}
        </div>
    )
}