"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction } from "react"
import { DialogTitle } from "@/components/ui/dialog"
import { Icon } from "@iconify/react"
import { z } from "zod"
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog"
import CustomInput1 from "../custom-utils/inputs/CustomInput1"
import {
    BankOption,
    addPayoutAccount,
    verifyAccountNumber,
    PayoutAccount,
} from "@/actions/payout"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import BankLogo from "../financials/BankLogo"
import { cn } from "@/lib/utils"

const addAccountSchema = z.object({
    bank_code: z.string().min(1, "Select a bank"),
    bank_name: z.string().min(1),
    account_number: z.string().length(10, "Account number must be 10 digits"),
})

type AddAccountFormValues = z.infer<typeof addAccountSchema>

type VerifyState = "idle" | "verifying" | "verified" | "failed"

interface Props {
    open: boolean
    onOpenChange: Dispatch<SetStateAction<boolean>>
    banks: BankOption[]
    onAdded: (account: PayoutAccount) => void
}

export default function AddBankAccountForm({ open, onOpenChange, banks, onAdded }: Props) {

    const dispatch = useAppDispatch()

    const [verifyState, setVerifyState] = useState<VerifyState>("idle")
    const [accountName, setAccountName] = useState<string | null>(null)

    const {
        register,
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddAccountFormValues>({
        resolver: zodResolver(addAccountSchema),
    })

    const bankCode = watch("bank_code")
    const accountNumber = watch("account_number")

    // Derive selected bank object from current code
    const selectedBank = banks.find(b => b.value === bankCode)

    // Auto-verify when both bank and 10-digit account number are filled
    useEffect(() => {
        setAccountName(null)
        setVerifyState("idle")

        if (!bankCode || accountNumber?.length !== 10) return

        const timer = setTimeout(async () => {
            setVerifyState("verifying")
            const result = await verifyAccountNumber(accountNumber, bankCode)

            if (result.success && result.account_name) {
                setAccountName(result.account_name)
                setVerifyState("verified")
            } else {
                setVerifyState("failed")
                setAccountName(null)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [bankCode, accountNumber])

    const handleClose = () => {
        reset()
        setAccountName(null)
        setVerifyState("idle")
        onOpenChange(false)
    }

    const onSubmit = async (values: AddAccountFormValues) => {
        if (verifyState !== "verified" || !accountName) return

        const result = await addPayoutAccount({
            bank_name: values.bank_name,
            account_name: accountName,
            account_number: values.account_number,
            bank_code: values.bank_code,
        })

        if (result.success && result.data) {
            onAdded(result.data)
            handleClose()
            dispatch(showAlert({
                variant: "default",
                title: "Account added",
                description: `${accountName} · ${values.bank_name} has been saved.`,
            }))
        } else {
            dispatch(showAlert({
                variant: "destructive",
                title: "Could not add account",
                description: result.message ?? "Please try again.",
            }))
        }
    }

    return (
        <AnimatedDialog className="md:max-w-[25em]" open={open} onOpenChange={onOpenChange}>
            <div>
                <div className="flex justify-center items-center flex-col text-center">
                    <DialogTitle className="font-semibold text-brand-secondary-9">Add Bank Account</DialogTitle>
                    <p className="text-sm text-brand-secondary-6 mt-2">Fill out the form to add a new bank account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">

                    {/* ── Bank selector with logo ──────────────────────────── */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-brand-secondary-9">
                            Bank Name <span className="text-red-500">*</span>
                        </label>

                        <Select
                            value={bankCode}
                            onValueChange={(val) => {
                                const bank = banks.find(b => b.value === val)
                                setValue("bank_code", val, { shouldValidate: true })
                                setValue("bank_name", bank?.name ?? "")
                                setAccountName(null)
                                setVerifyState("idle")
                            }}
                        >
                            <SelectTrigger
                                id="bank-select"
                                className={cn(
                                    "h-14! w-full rounded-xl border-brand-secondary-3 bg-white text-brand-secondary-9 text-sm",
                                    "focus:ring-1 focus:ring-brand-accent-4 focus:border-brand-accent-4",
                                    errors.bank_code && "border-red-400 focus:ring-red-300",
                                )}
                            >
                                <SelectValue placeholder="Select a bank">
                                    {selectedBank && (
                                        <span className="flex items-center gap-2.5">
                                            <span className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-brand-neutral-3">
                                                <BankLogo bankName={selectedBank.name} />
                                            </span>
                                            <span className="truncate">{selectedBank.name}</span>
                                        </span>
                                    )}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent className="max-h-64 overflow-y-auto">
                                {banks.map((bank) => (
                                    <SelectItem key={bank.value} value={bank.value}>
                                        <span className="flex items-center gap-2.5 py-0.5">
                                            <span className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-brand-neutral-3">
                                                <BankLogo bankName={bank.name} />
                                            </span>
                                            <span className="truncate text-sm">{bank.name}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {errors.bank_code && (
                            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                <Icon icon="mage:exclamation-circle" className="size-3.5 shrink-0" />
                                {errors.bank_code.message}
                            </p>
                        )}
                    </div>

                    {/* ── Account number + live verification ───────────────── */}
                    <div className="space-y-1">
                        <CustomInput1
                            label="Account Number"
                            placeholder="Enter 10-digit account number"
                            maxLength={10}
                            error={errors.account_number?.message}
                            {...register("account_number")}
                        />

                        {/* Verification feedback */}
                        <div className="h-6 flex items-center px-1">
                            {verifyState === "verifying" && (
                                <span className="flex items-center gap-1.5 text-xs text-brand-secondary-5">
                                    <Icon icon="eos-icons:three-dots-loading" className="size-8 text-brand-primary-6" />
                                    Verifying account...
                                </span>
                            )}

                            {verifyState === "verified" && accountName && (
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 animate-in fade-in duration-300">
                                    <Icon icon="hugeicons:checkmark-circle-02" className="size-4 shrink-0" />
                                    {accountName}
                                </span>
                            )}

                            {verifyState === "failed" && (
                                <span className="flex items-center gap-1.5 text-xs text-red-500 animate-in fade-in duration-300">
                                    <Icon icon="hugeicons:alert-circle" className="size-4 shrink-0" />
                                    Account not found. Check details and try again.
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between gap-4 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 text-brand-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3.5 rounded-[30px] border-2 border-brand-secondary-3 font-medium text-sm hover:bg-brand-neutral-2 hover:border-brand-secondary-5 active:bg-brand-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150"
                        >
                            Cancel
                        </button>

                        <ActionButton1
                            isLoading={isSubmitting}
                            isDisabled={verifyState !== "verified" || isSubmitting}
                            className="flex-1"
                            buttonType="submit"
                            buttonText="Confirm"
                        />
                    </div>
                </form>
            </div>
        </AnimatedDialog>
    )
}