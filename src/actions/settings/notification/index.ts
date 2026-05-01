import { NOTIFICATION_SETTINGS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { cacheTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"

interface NotificationResult {
    success:  boolean
    data?:    NotificationSettings
    message?: string
}

export async function getNotificationSettings(token: string | undefined): Promise<NotificationResult> {
    'use cache'
    cacheTag(CACHE_TAGS.NOTIFICATION_SETTINGS)
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${NOTIFICATION_SETTINGS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data ?? json }

    } catch (error: any) {
        return { success: false, message: "Failed to load notification settings." }
    }
}