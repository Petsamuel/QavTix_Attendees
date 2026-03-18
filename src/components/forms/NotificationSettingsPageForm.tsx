"use client"

import { useCallback, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ToggleItem } from "@/components/custom-utils/inputs/CustomToggleItem"
import {
    NotificationFormValues,
    notificationSchema,
    toFormValues,
    toPayload,
} from "@/schemas/notification.schema"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { updateNotificationSettings } from "@/actions/settings/notification"

interface Props {
    initialSettings: NotificationSettings
}

export default function NotificationSettingsPageForm({ initialSettings }: Props) {

    const dispatch = useAppDispatch()
    const [anyLoading, setAnyLoading] = useState(false)

    const { control, getValues } = useForm<NotificationFormValues>({
        resolver:      zodResolver(notificationSchema),
        defaultValues: toFormValues(initialSettings),
    })

    // Called by each toggle — reads current form values and patches API
    const save = useCallback(async () => {
        setAnyLoading(true)
        const result = await updateNotificationSettings(toPayload(getValues()))
        setAnyLoading(false)

        if (!result.success) {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Could not save preferences",
                description: result.message ?? "Please try again.",
            }))
        }
    }, [getValues, dispatch])

    return (
        <main className="w-full pt-8 pb-16">
            <form className="space-y-12">
                <h2 className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9")}>
                    Notification
                </h2>

                {/* Email Notifications */}
                <section className="space-y-6">
                    <header>
                        <h3 className="text-base font-bold text-brand-secondary-9">Email Notifications:</h3>
                        <p className="text-sm text-brand-secondary-9">Choose the type of emails you'd like to receive</p>
                    </header>

                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />

                    <div className="w-full max-w-sm space-y-5">
                        <ToggleItem control={control} name="emailNotifications.orderConfirmations"    label="Order confirmations"            disabled={anyLoading} onChange={save} />
                        <ToggleItem control={control} name="emailNotifications.ticketDelivery"        label="Ticket delivery"                disabled={anyLoading} onChange={save} />
                        <ToggleItem control={control} name="emailNotifications.eventReminders"        label="Event reminders (24h before)"   disabled={anyLoading} onChange={save} />
                        <ToggleItem control={control} name="emailNotifications.priceDropAlerts"       label="Price drop alerts"              disabled={anyLoading} onChange={save} />
                        <ToggleItem control={control} name="emailNotifications.similarEvents"         label="Similar events suggestions"     disabled={anyLoading} onChange={save} />
                        <ToggleItem control={control} name="emailNotifications.weeklyDigest"          label="Weekly event digest"            disabled={anyLoading} onChange={save} />
                        <ToggleItem control={control} name="emailNotifications.promotionalOffers"     label="Promotional offers"             disabled={anyLoading} onChange={save} />
                        <ToggleItem control={control} name="emailNotifications.accountSecurityAlerts" label="Account security alerts"        disabled={anyLoading} onChange={save} />
                    </div>
                </section>

                {/* SMS Notifications */}
                <section className="space-y-6">
                    <header>
                        <h3 className="font-bold text-brand-secondary-9">SMS Notifications:</h3>
                        <p className="text-sm text-brand-secondary-9">Manage your SMS notification preferences</p>
                    </header>

                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />

                    <div className="w-full max-w-sm space-y-5">
                        <ToggleItem control={control} name="smsNotifications.orderConfirmations" label="Order confirmations"          disabled={anyLoading} onChange={save} />
                        <ToggleItem control={control} name="smsNotifications.eventReminders"     label="Event reminders (24h before)" disabled={anyLoading} onChange={save} />
                        <ToggleItem control={control} name="smsNotifications.promotionalOffers"  label="Promotional offers"           disabled={anyLoading} onChange={save} />
                    </div>
                </section>
            </form>
        </main>
    )
}