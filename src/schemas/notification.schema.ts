import * as z from "zod";

export const notificationSchema = z.object({
    emailNotifications: z.object({
        orderConfirmations: z.boolean(),
        ticketDelivery: z.boolean(),
        eventReminders: z.boolean(),
        priceDropAlerts: z.boolean(),
        similarEvents: z.boolean(),
        weeklyDigest: z.boolean(),
        promotionalOffers: z.boolean(),
        accountSecurityAlerts: z.boolean(),
    }),
    smsNotifications: z.object({
        orderConfirmations: z.boolean(),
        eventReminders: z.boolean(),
        promotionalOffers: z.boolean(),
    })
})

export type NotificationFormValues = z.infer<typeof notificationSchema>;