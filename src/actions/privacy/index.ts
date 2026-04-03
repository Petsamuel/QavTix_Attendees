"use server"

import {
    DOWNLOAD_DATA_ENDPOINT,
    DELETE_ACCOUNT_ENDPOINT,
    GET_PRIVACY_SETTINGS_ENDPOINT,
    SET_PRIVACY_SETTINGS_ENDPOINT,
    CANCEL_PLAN_ENDPOINT,
} from "@/endpoints";
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"
import { CACHE_TAGS } from "@/cache-tags"

interface PrivacyResult {
    success:  boolean
    data?:    PrivacySettings
    message?: string
}

export async function getPrivacySettings(): Promise<PrivacyResult> {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_PRIVACY_SETTINGS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                next: { tags: [CACHE_TAGS.PRIVACY_SETTINGS] },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data ?? json }

    } catch (error: any) {
        console.log("[getPrivacySettings] error:", error)
        return { success: false, message: "Failed to load privacy settings." }
    }
}

export async function updatePrivacySettings(
    payload: PrivacySettings,
): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.patch(SET_PRIVACY_SETTINGS_ENDPOINT, payload)
        revalidateTag(CACHE_TAGS.PRIVACY_SETTINGS, "max")
        return { success: true }
    } catch (error: any) {
        console.log("[updatePrivacySettings] status:", error?.response?.status)
        console.log("[updatePrivacySettings] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function downloadPrivacyData(): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(DOWNLOAD_DATA_ENDPOINT)
        return { success: true }
    } catch (error: any) {
        console.log("[downloadPrivacyData] status:", error?.response?.status)
        console.log("[downloadPrivacyData] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function deleteAccount(): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.delete(DELETE_ACCOUNT_ENDPOINT)

        const cookieStore = await cookies()
        cookieStore.delete("access_token")
        cookieStore.delete("refresh_token")

        return { success: true }
    } catch (error: any) {
        console.log("[deleteAccount] status:", error?.response?.status)
        console.log("[deleteAccount] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function cancelPlan(): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(CANCEL_PLAN_ENDPOINT)
        revalidateTag(CACHE_TAGS.PROFILE, "max")
        return { success: true }
    } catch (error: any) {
        console.log("[cancelPlan] status:", error?.response?.status)
        console.log("[cancelPlan] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}