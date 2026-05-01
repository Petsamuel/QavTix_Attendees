"use client"

import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify/react"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { passwordSchema, PasswordSchema } from "@/schemas/security.schema"
import PasswordInput from "@/components/custom-utils/inputs/PasswordInput"
import PasswordStrengthIndicator from "@/components/custom-utils/security/PasswordStrengthIndicator"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { changePassword, toggle2FAProvider } from "@/actions/settings/security/client"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"

interface Props {
    initialProviders: TwoFactorProvider[]
}

export default function SecurityPageForm({ initialProviders }: Props) {

    const dispatch = useAppDispatch()
    const [providers, setProviders] = useState<TwoFactorProvider[]>(initialProviders)
    const [togglingId, setTogglingId] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema),
    })

    const newPassword = watch("newPassword")

    const handleToggle = async (provider: TwoFactorProvider) => {
        if (togglingId) return
        setTogglingId(provider.id)

        const enabling = provider.status !== "connected"
        const result = await toggle2FAProvider(provider.id, enabling)

        if (result.success) {
            setProviders(prev => prev.map(p =>
                p.id === provider.id
                    ? { ...p, status: enabling ? "connected" : "disconnected" }
                    : p
            ))
            dispatch(showAlert({
                variant: "success",
                title: enabling ? `${provider.name} enabled` : `${provider.name} disabled`,
                description: enabling
                    ? `Two-factor authentication via ${provider.name} is now active.`
                    : `${provider.name} has been disconnected.`,
            }))
        } else {
            dispatch(showAlert({
                variant: "destructive",
                title: "Could not update 2FA",
                description: result.message ?? "Please try again.",
            }))
        }

        setTogglingId(null)
    }


    const onSubmit: SubmitHandler<PasswordSchema> = async (data) => {
        const result = await changePassword(data.currentPassword, data.newPassword)

        if (result.success) {
            reset()
            dispatch(showAlert({
                variant: "success",
                title: "Password updated",
                description: "Your password has been changed successfully.",
            }))
        } else {
            dispatch(showAlert({
                variant: "destructive",
                title: "Password update failed",
                description: result.message ?? "Please check your current password and try again.",
            }))
        }
    }

    return (
        <main className="pt-8 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-0">

                {/* 2FA Section */}
                <div className="md:pr-8 lg:pr-12">
                    <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 text-lg font-bold mb-10")}>
                        Two-Factor Authentication (2FA)
                    </h3>
                    <div className="space-y-4">
                        {providers.map(provider => {
                            const isToggling = togglingId === provider.id

                            return (
                                <div
                                    key={provider.id}
                                    className="flex items-center justify-between p-4 bg-white shadow-[0px_5.8px_23.17px_0px_#3326AE14] rounded-xl border border-gray-200 hover:border-brand-primary-1 transition-colors"
                                >
                                    <div className="flex gap-4 items-start">
                                        <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                                            <Image
                                                src={provider.icon}
                                                alt={provider.name}
                                                width={24}
                                                height={24}
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <h3 className="font-bold text-sm text-brand-secondary-9">
                                                {provider.name}
                                            </h3>
                                            <p className="text-[11px] text-brand-secondary-5">
                                                {provider.status === "not_connected"
                                                    ? "Not connected yet"
                                                    : provider.email ?? "Connected"
                                                }
                                            </p>

                                            <button
                                                type="button"
                                                disabled={isToggling}
                                                className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#04802E] hover:text-green-700 transition-colors group disabled:opacity-50"
                                            >
                                                {provider.status === "not_connected" ? (
                                                    <>
                                                        <span>Connect Now</span>
                                                        <Icon icon="hugeicons:arrow-right-01" className="group-hover:translate-x-0.5 transition-transform" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Disconnect {provider.name}</span>
                                                        <Icon icon="hugeicons:arrow-right-01" className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Switch with inline spinner while toggling */}
                                    <div className="flex items-center justify-center w-10 h-6">
                                        {isToggling ? (
                                            <Icon
                                                icon="eos-icons:three-dots-loading"
                                                className="size-10 text-brand-primary-6"
                                            />
                                        ) : (
                                            <Switch
                                                checked={provider.status === "connected"}
                                                onCheckedChange={() => handleToggle(provider)}
                                                disabled={!!togglingId}
                                                className="data-[state=checked]:bg-brand-primary-6 disabled:opacity-50"
                                            />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Divider */}
                <div className="relative my-8 md:my-0 flex justify-center h-full">
                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2 md:hidden" />
                    <div className="hidden md:block h-full border-l-[1.5px] border-dashed border-brand-secondary-2" />
                </div>

                {/* Password Section */}
                <div className="md:pl-8 lg:pl-12">
                    <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 text-lg font-bold mb-10")}>
                        Security
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
                        <PasswordInput
                            label="Current Password"
                            placeholder="........."
                            required
                            {...register("currentPassword")}
                            error={errors.currentPassword?.message}
                        />
                        <PasswordInput
                            label="New Password"
                            placeholder=".........."
                            required
                            {...register("newPassword")}
                            error={errors.newPassword?.message}
                        />
                        <PasswordInput
                            label="Confirm Password"
                            placeholder="............."
                            required
                            {...register("confirmPassword")}
                            error={errors.confirmPassword?.message}
                        />

                        <PasswordStrengthIndicator password={newPassword} />

                        <ActionButton1
                            buttonText={isSubmitting ? "Updating..." : "Update Password"}
                            className="rounded-lg w-full"
                            iconPosition="right"
                            buttonType="submit"
                            icon={isSubmitting ? "eos-icons:three-dots-loading" : "gravity-ui:arrow-right"}
                            isDisabled={isSubmitting || !isDirty}
                            isLoading={isSubmitting}
                        />
                    </form>
                </div>
            </div>
        </main>
    )
}