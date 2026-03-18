import { z } from "zod"

export const notificationSchema = z.object({
    emailNotifications: z.object({
        orderConfirmations:   z.boolean(),
        ticketDelivery:       z.boolean(),
        eventReminders:       z.boolean(),
        priceDropAlerts:      z.boolean(),
        similarEvents:        z.boolean(),
        weeklyDigest:         z.boolean(),
        promotionalOffers:    z.boolean(),
        accountSecurityAlerts: z.boolean(),
    }),
    smsNotifications: z.object({
        orderConfirmations: z.boolean(),
        eventReminders:     z.boolean(),
        promotionalOffers:  z.boolean(),
    }),
})

export type NotificationFormValues = z.infer<typeof notificationSchema>

export const toFormValues = (s: NotificationSettings): NotificationFormValues => ({
    emailNotifications: {
        orderConfirmations:    s.email_order_confirmations,
        ticketDelivery:        s.email_ticket_delivery,
        eventReminders:        s.email_event_reminders,
        priceDropAlerts:       s.email_price_drop_alerts,
        similarEvents:         s.email_similar_events,
        weeklyDigest:          s.email_weekly_digest,
        promotionalOffers:     s.email_promotional_offers,
        accountSecurityAlerts: s.email_account_security,
    },
    smsNotifications: {
        orderConfirmations: s.sms_order_confirmations,
        eventReminders:     s.sms_event_reminders,
        promotionalOffers:  s.sms_promotional_offers,
    },
})

export const toPayload = (v: NotificationFormValues) => ({
    email_order_confirmations: v.emailNotifications.orderConfirmations,
    email_ticket_delivery:     v.emailNotifications.ticketDelivery,
    email_event_reminders:     v.emailNotifications.eventReminders,
    email_price_drop_alerts:   v.emailNotifications.priceDropAlerts,
    email_similar_events:      v.emailNotifications.similarEvents,
    email_weekly_digest:       v.emailNotifications.weeklyDigest,
    email_promotional_offers:  v.emailNotifications.promotionalOffers,
    email_account_security:    v.emailNotifications.accountSecurityAlerts,
    sms_order_confirmations:   v.smsNotifications.orderConfirmations,
    sms_event_reminders:       v.smsNotifications.eventReminders,
    sms_promotional_offers:    v.smsNotifications.promotionalOffers,
})