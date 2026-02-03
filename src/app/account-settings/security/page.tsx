"use client"

import { AuthProvider, INITIAL_PROVIDERS } from "@/components-data/auth-providers"
import PasswordInput from "@/components/custom-utils/inputs/PasswordInput"
import PasswordStrengthIndicator from "@/components/custom-utils/security/PasswordStrengthIndicator"
import { Switch } from "@/components/ui/switch"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { passwordSchema, PasswordSchema } from "@/schemas/security.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify/react"
import Image from "next/image"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

export default function SecurityPage() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema),
    })

    const [providers, setProviders] = useState<AuthProvider[]>(INITIAL_PROVIDERS)

    const onSubmit : SubmitHandler<PasswordSchema> = (data) => {
        console.log("hello")
    }

    const toggleProvider = (id: string) => {
        setProviders((prev) =>
            prev.map((p) => {
                if (p.id === id) {
                    const isNowConnected = p.status !== "connected";
                    return {
                        ...p,
                        status: isNowConnected ? "connected" : "disconnected",
                    }
                }
                return p;
            })
        )
    }

    const newPassword = watch("newPassword")

    return (
        <main className="pt-8 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-0">
                {/* Two-Factor Authentication Section */}
                <div className="md:pr-8 lg:pr-12">
                    <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 text-lg font-bold mb-10")}>
                        Two-Factor Authentication (2FA)
                    </h3>
                    <div className="space-y-4">
                        {providers.map((provider) => (
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

                                    {/* Details */}
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-bold text-sm text-brand-secondary-9">
                                            {provider.name}
                                        </h3>
                                        <p className="text-[11px] text-brand-secondary-5">
                                            {provider.status === "not_connected"
                                                ? "Not Connected yet"
                                                : provider.email}
                                        </p>

                                        <button className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#04802E] hover:text-green-700 transition-colors group">
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

                                <Switch
                                    checked={provider.status === "connected"}
                                    onCheckedChange={() => toggleProvider(provider.id)}
                                    className="data-[state=checked]:bg-brand-primary-6"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="relative my-8 md:my-0 flex justify-center h-full">
                    {/* Mobile - Horizontal Line */}
                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2 md:hidden" />
                    
                    {/* Desktop - Vertical Line */}
                    <div className="hidden md:block h-full border-l-[1.5px] border-dashed border-brand-secondary-2" />
                </div>

                {/* Security Section */}
                <div className="md:pl-8 lg:pl-12">
                    <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 text-lg font-bold mb-10")}>
                        Security
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
                        <PasswordInput
                            label="Current Password"
                            placeholder="........."
                            required
                            {...register('currentPassword')}
                            error={errors.currentPassword?.message}
                        />
                        <PasswordInput
                            label="New Password"
                            placeholder=".........."
                            required
                            {...register('newPassword')}
                            error={errors.newPassword?.message}
                        />
                        <PasswordInput
                            label="Confirm Password"
                            placeholder="............."
                            required
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                        />

                        <PasswordStrengthIndicator password={newPassword} />

                        <button
                            type="submit"
                            disabled={!!isSubmitting || !isDirty}
                            className="px-6 py-4 w-full mt-7 rounded-md bg-brand-primary hover:bg-brand-primary-7 active:bg-brand-primary-8 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-150 flex items-center justify-center gap-2"
                        >
                            <span>Update Password</span>
                            <Icon icon="lets-icons:arrow-right" width="24" height="24" />
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}