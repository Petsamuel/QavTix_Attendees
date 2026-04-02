"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog"
import { cn } from "@/lib/utils"
import { closePasswordModal, resetPasswordStatus, setPasswordStatus } from "@/lib/redux/slices/passwordModalConfirmationSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { usePathname } from "next/navigation"
import { Icon } from "@iconify/react"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"
import { cancelPlan, deleteAccount } from "@/actions/privacy"
import { logOut, verifyPassword } from "@/actions/auth"

export default function PasswordModal() {

    const dispatch     = useAppDispatch()
    const router       = useRouter()
    const pathName     = usePathname()
    const [password,      setPassword]      = useState("")
    const [showPassword,  setShowPassword]  = useState(false)
    const [isProcessing,  setIsProcessing]  = useState(false)

    const { isOpen, status, lastVerifiedAction } = useAppSelector(state => state.passwordModal)
    const { user } = useAppSelector(state => state.authUser)

    // Close on route change
    useEffect(() => {
        if (isOpen) {
            dispatch(closePasswordModal())
            dispatch(resetPasswordStatus())
        }
    }, [pathName])

    const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!password || !user?.email) return

        setIsProcessing(true)
        dispatch(setPasswordStatus("submitting"))

        const verifyResult = await verifyPassword(user.email, password)

        if (!verifyResult.success) {
            dispatch(setPasswordStatus("error"))
            setIsProcessing(false)
            return
        }

        if (lastVerifiedAction === "delete_account") {
            const deleteResult = await deleteAccount()

            if (deleteResult.success) {
                dispatch(closePasswordModal())
                dispatch(openSuccessModal({
                    title:       "Deletion Complete",
                    description: "Your account has been permanently removed. Thank you for being with us.",
                    variant:     "account_deleted",
                    autoClose:   true,
                    autoCloseDelay: 3000,
                }))
                setTimeout(async () => {
                    await logOut()
                }, 3200)
            } else {
                dispatch(setPasswordStatus("error"))
                setIsProcessing(false)
            }
        }

        else if (lastVerifiedAction === "cancel_plan") {
            const cancelResult = await cancelPlan()

            if (cancelResult.success) {
                dispatch(closePasswordModal())
                dispatch(openSuccessModal({
                    title:          "Plan Cancelled",
                    description:    "Your subscription has been cancelled. You'll retain access until the end of your billing period.",
                    variant:        "success",
                    autoClose:      true,
                }))
            } else {
                dispatch(setPasswordStatus("error"))
                setIsProcessing(false)
            }
        }


        setPassword("")
        setIsProcessing(false)
    }

    return (
        <AnimatedDialog
            open={isOpen}
            onOpenChange={() => {
                dispatch(closePasswordModal())
                setPassword("")
            }}
            showCloseButton={false}
            className="md:max-w-sm py-4"
        >
            <DialogHeader className="flex flex-col items-center justify-center text-center mb-6">
                <DialogTitle className="text-xl font-bold text-brand-secondary-9">
                    Enter Password
                </DialogTitle>
                <DialogDescription className="text-sm text-brand-secondary-5 mt-1">
                    Enter password to confirm
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleConfirm}>
                <div className="mt-6 px-1">
                    <label className="block text-sm font-semibold text-brand-neutral-9 mb-2">
                        Password
                    </label>
                    <div className="relative group">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className={cn(
                                "w-full h-12 px-4 rounded-md border-[1.4px] transition-all outline-none",
                                "border-brand-primary-4 bg-brand-secondary-1 focus:border-brand-primary-6 focus:bg-white",
                                status === "error" && "border-red-500"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-secondary-4 hover:text-brand-secondary-9 transition-colors"
                        >
                            <Icon icon={showPassword ? "hugeicons:view-off-slash" : "hugeicons:view"} width="20" />
                        </button>
                    </div>
                    {status === "error" && (
                        <p className="text-xs text-red-500 mt-2 text-center">Incorrect password. Please try again.</p>
                    )}
                </div>

                <DialogFooter className="mt-8 flex flex-row gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            dispatch(closePasswordModal())
                            setPassword("")
                        }}
                        className="flex-1 h-12 md:h-14 rounded-full border border-brand-secondary-6 text-brand-secondary-8 font-semibold text-sm hover:bg-brand-neutral-3 transition-all"
                    >
                        Cancel
                    </button>
                    <ActionButton1
                        buttonText="Yes, I am"
                        buttonType="submit"
                        isDisabled={!password}
                        isLoading={isProcessing}
                        className="w-[55%]"
                    />
                </DialogFooter>
            </form>
        </AnimatedDialog>
    )
}