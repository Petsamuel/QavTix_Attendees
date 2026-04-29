"use server"

import { NOTIFICATION_SETTINGS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag, cacheTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"

type UpdateNotificationPayload = Omit<NotificationSettings, "id">

interface NotificationResult {
    success:  boolean
    data?:    NotificationSettings
    message?: string
}

export async function getNotificationSettings(): Promise<NotificationResult> {
    const accessToken = (await cookies()).get("access_token")?.value;
    return _getNotificationSettings(accessToken);
}

async function _getNotificationSettings(accessToken: string | undefined): Promise<NotificationResult> {
    "use cache"
    cacheTag(CACHE_TAGS.NOTIFICATION_SETTINGS)
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${NOTIFICATION_SETTINGS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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
        console.log("[getNotificationSettings] error:", error)
        return { success: false, message: "Failed to load notification settings." }
    }
}

export async function updateNotificationSettings(
    payload: UpdateNotificationPayload,
): Promise<NotificationResult> {
    const axiosInstance = await getServerAxios()
try {
        const { data } = await axiosInstance.patch(NOTIFICATION_SETTINGS_ENDPOINT, payload)
        revalidateTag(CACHE_TAGS.NOTIFICATION_SETTINGS, "max")
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        console.log("[updateNotificationSettings] status:", error?.response?.status)
        console.log("[updateNotificationSettings] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}