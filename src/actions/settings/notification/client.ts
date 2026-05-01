"use server"

import { NOTIFICATION_SETTINGS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"

type UpdateNotificationPayload = Omit<NotificationSettings, "id">

interface NotificationResult {
    success:  boolean
    data?:    NotificationSettings
    message?: string
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
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}
