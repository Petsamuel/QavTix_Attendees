"use server"

import { getServerAxios } from "@/lib/axios"
import { ATTENDEE_NOTIFICATIONS_ENDPOINT } from "@/endpoints"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags/index"

interface NotificationParams {
    page?: number;
    notification_type?: string;
    mark_read?: boolean;
}

export async function getAttendeeNotifications(params: NotificationParams = {}): Promise<{ success: boolean; data?: AttendeeNotificationsData; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${ATTENDEE_NOTIFICATIONS_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load notifications." }
    }
}

export async function markNotificationsAsRead(): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()
        await axios.get(`/${ATTENDEE_NOTIFICATIONS_ENDPOINT}`, { params: { mark_read: true } })
        revalidateTag(CACHE_TAGS.NOTIFICATIONS, "max")
        return { success: true }
    } catch (err) {
        return { success: false, message: "Failed to mark notifications as read." }
    }
}
