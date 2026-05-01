import { getNotificationSettings } from "@/actions/settings/notification/index"
import NotificationSettingsPageForm from "@/components/forms/NotificationSettingsPageForm"
import { ATTENDEE_PAGE_METADATA } from "@/lib/metadata"
import type { Metadata } from "next"
import { cookies } from "next/headers";


export const metadata: Metadata = ATTENDEE_PAGE_METADATA.NOTIFICATIONS;


const DEFAULT_SETTINGS = {
    id: 0,
    email_order_confirmations: true,
    email_ticket_delivery: true,
    email_event_reminders: true,
    email_price_drop_alerts: false,
    email_similar_events: false,
    email_weekly_digest: false,
    email_promotional_offers: false,
    email_account_security: true,
    sms_order_confirmations: true,
    sms_event_reminders: false,
    sms_promotional_offers: false,
}

export default async function NotificationsPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const result = await getNotificationSettings(token)

    const settings = result.success && result.data
        ? result.data
        : DEFAULT_SETTINGS

    return <NotificationSettingsPageForm initialSettings={settings} />
}