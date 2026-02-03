"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToggleItem } from "@/components/custom-utils/inputs/CustomToggleItem";
import { NotificationFormValues, notificationSchema } from "@/schemas/notification.schema";
import { cn } from "@/lib/utils";
import { space_grotesk } from "@/lib/fonts";

export default function NotificationSettingsPage() {
    const { handleSubmit, control } = useForm<NotificationFormValues>({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            emailNotifications: {
                orderConfirmations: true,
                ticketDelivery: true,
                eventReminders: true,
                priceDropAlerts: false,
                similarEvents: false,
                weeklyDigest: false,
                promotionalOffers: false,
                accountSecurityAlerts: true,
            },
            smsNotifications: {
                orderConfirmations: true,
                eventReminders: false,
                promotionalOffers: false,
            }
        }
    })

    const onSubmit : SubmitHandler<NotificationFormValues> = (data) => {
        console.log("Settings Saved:", data)
    }

    return (
        <main className="w-full pt-8 pb-16">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                <h2 className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9")}>Notification</h2>
                
                {/* Email Notifications Section */}
                <section className="space-y-6">
                    <header>
                        <h3 className="text-base font-bold text-brand-secondary-9">Email Notifications:</h3>
                        <p className="text-sm text-brand-secondary-9">Choose the type of emails you'd like to receive</p>
                    </header>

                    <div className="relative flex justify-center h-full">
                        {/* Horizontal Line */}
                        <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />
                    </div>
                    
                    <div className="w-full max-w-sm border-t border-dashed border-gray-200 space-y-5">
                        <ToggleItem control={control} name="emailNotifications.orderConfirmations" label="Order confirmations" />
                        <ToggleItem control={control} name="emailNotifications.ticketDelivery" label="Ticket delivery" />
                        <ToggleItem control={control} name="emailNotifications.eventReminders" label="Event reminders (24h before)" />
                        <ToggleItem control={control} name="emailNotifications.priceDropAlerts" label="Price drop alerts" />
                        <ToggleItem control={control} name="emailNotifications.similarEvents" label="Similar events suggestions" />
                        <ToggleItem control={control} name="emailNotifications.weeklyDigest" label="Weekly event digest" />
                        <ToggleItem control={control} name="emailNotifications.promotionalOffers" label="Promotional offers" />
                        <ToggleItem control={control} name="emailNotifications.accountSecurityAlerts" label="Account security alerts" />
                    </div>
                </section>

                {/* SMS Notifications Section */}
                <section className="space-y-6">
                    <header>
                        <h3 className="font-bold text-brand-secondary-9">SMS Notifications:</h3>
                        <p className="text-sm text-brand-secondary-9">Manage your SMS notification preferences</p>
                    </header>

                    <div className="relative flex justify-center h-full">
                        {/* Horizontal Line */}
                        <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />
                    </div>
                    
                    <div className="w-full max-w-sm border-t border-dashed border-gray-200 space-y-5">
                        <ToggleItem control={control} name="smsNotifications.orderConfirmations" label="Order confirmations" />
                        <ToggleItem control={control} name="smsNotifications.eventReminders" label="Event reminders (24h before)" />
                        <ToggleItem control={control} name="smsNotifications.promotionalOffers" label="Promotional offers" />
                    </div>
                </section>
            </form>
        </main>
    )
}