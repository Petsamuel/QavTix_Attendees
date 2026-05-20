"use server"

import {
    DOWNLOAD_DATA_ENDPOINT,
    DELETE_ACCOUNT_ENDPOINT,
    SET_PRIVACY_SETTINGS_ENDPOINT,
    CANCEL_PLAN_ENDPOINT,
} from "@/endpoints";
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"
import { CACHE_TAGS } from "@/cache-tags"

export async function updatePrivacySettings(
    payload: PrivacySettings,
): Promise<{ success: boolean; message?: string }> {
    const axiosInstance = await getServerAxios()
    try {
        await axiosInstance.patch(SET_PRIVACY_SETTINGS_ENDPOINT, payload)
        revalidateTag(CACHE_TAGS.PRIVACY_SETTINGS, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function downloadPrivacyData(): Promise<{ success: boolean; message?: string }> {
    const axiosInstance = await getServerAxios()
    try {
        await axiosInstance.post(DOWNLOAD_DATA_ENDPOINT)
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function deleteAccount(): Promise<{ success: boolean; message?: string }> {
    const axiosInstance = await getServerAxios()
    try {
        await axiosInstance.post(DELETE_ACCOUNT_ENDPOINT)

        const cookieStore = await cookies()
        cookieStore.delete("access_token")
        cookieStore.delete("refresh_token")

        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function cancelPlan(): Promise<{ success: boolean; message?: string }> {
    const axiosInstance = await getServerAxios()
    try {
        await axiosInstance.post(CANCEL_PLAN_ENDPOINT)
        revalidateTag(CACHE_TAGS.PROFILE, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}
