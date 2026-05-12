import { ATTENDEE_NOTIFICATIONS_ENDPOINT } from "@/endpoints"

export interface NotificationParams {
    page?: number;
    notification_type?: string;
    mark_read?: boolean;
}

export async function getAttendeeNotifications(token: string | undefined, params: NotificationParams = {}): Promise<{ success: boolean; data?: AttendeeNotificationsData; message?: string }> {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${ATTENDEE_NOTIFICATIONS_ENDPOINT}`)
        Object.entries(params).forEach(([k, v]) => {
            if (v != null) url.searchParams.set(k, String(v))
        })

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })

        if (!res.ok) return { success: false, message: "Failed to load notifications." }

        const json = await res.json()
        return { success: true, data: json.data ?? json }
    } catch (err) {
        return { success: false, message: "Failed to load notifications." }
    }
}
