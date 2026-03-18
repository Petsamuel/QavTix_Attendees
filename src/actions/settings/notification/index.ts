"use server"

import { NOTIFICATION_SETTINGS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"


type UpdateNotificationPayload = Omit<NotificationSettings, "id">

interface NotificationResult {
    success:  boolean
    data?:    NotificationSettings
    message?: string
}

export async function getNotificationSettings(): Promise<NotificationResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(NOTIFICATION_SETTINGS_ENDPOINT)
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        console.log("[getNotificationSettings] status:", error?.response?.status)
        console.log("[getNotificationSettings] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function updateNotificationSettings(
    payload: UpdateNotificationPayload,
): Promise<NotificationResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.patch(NOTIFICATION_SETTINGS_ENDPOINT, payload)
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        console.log("[updateNotificationSettings] status:", error?.response?.status)
        console.log("[updateNotificationSettings] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}