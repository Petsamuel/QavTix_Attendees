import { getNotificationSettings } from "@/actions/settings/notification"
import NotificationSettingsPageForm from "@/components/forms/NotificationSettingsPageForm"

const DEFAULT_SETTINGS = {
    id:                           0,
    email_order_confirmations:    true,
    email_ticket_delivery:        true,
    email_event_reminders:        true,
    email_price_drop_alerts:      false,
    email_similar_events:         false,
    email_weekly_digest:          false,
    email_promotional_offers:     false,
    email_account_security:       true,
    sms_order_confirmations:      true,
    sms_event_reminders:          false,
    sms_promotional_offers:       false,
}

export default async function NotificationsPage() {
    const result = await getNotificationSettings()

    const settings = result.success && result.data
        ? result.data
        : DEFAULT_SETTINGS

    return <NotificationSettingsPageForm initialSettings={settings} />
}