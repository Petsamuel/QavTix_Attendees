interface NotificationSettings {
    id:                           number
    email_order_confirmations:    boolean
    email_ticket_delivery:        boolean
    email_event_reminders:        boolean
    email_price_drop_alerts:      boolean
    email_similar_events:         boolean
    email_weekly_digest:          boolean
    email_promotional_offers:     boolean
    email_account_security:       boolean
    sms_order_confirmations:      boolean
    sms_event_reminders:          boolean
    sms_promotional_offers:       boolean
}


interface TwoFactorProvider {
    id:     string
    name:   string
    icon:   string
    status: "connected" | "disconnected" | "not_connected"
    email?: string
}