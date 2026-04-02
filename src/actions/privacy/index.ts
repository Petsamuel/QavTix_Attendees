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
import { cookies } from "next/headers"

interface PrivacyResult {
    success:  boolean
    data?:    PrivacySettings
    message?: string
}

export async function getPrivacySettings(): Promise<PrivacyResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(GET_PRIVACY_SETTINGS_ENDPOINT)
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        console.log("[getPrivacySettings] status:", error?.response?.status)
        console.log("[getPrivacySettings] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function updatePrivacySettings(
    payload: PrivacySettings,
): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.patch(SET_PRIVACY_SETTINGS_ENDPOINT, payload)
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
        return { success: true }
    } catch (error: any) {
        console.log("[cancelPlan] status:", error?.response?.status)
        console.log("[cancelPlan] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}