"use server"

import { TWO_FACTOR_ENDPOINT, CHANGE_PASSWORD_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"

export interface TwoFactorProvider {
    id:     string
    name:   string
    icon:   string
    status: "connected" | "disconnected" | "not_connected"
    email?: string
}

interface Get2FAResult {
    success:  boolean
    data?:    TwoFactorProvider[]
    message?: string
}

interface Toggle2FAResult {
    success:  boolean
    message?: string
}

interface ChangePasswordResult {
    success:  boolean
    message?: string
}

export async function get2FASettings(): Promise<Get2FAResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(TWO_FACTOR_ENDPOINT)
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        console.log("[get2FASettings] status:", error?.response?.status)
        console.log("[get2FASettings] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function toggle2FAProvider(
    providerId: string,
    enable:     boolean,
): Promise<Toggle2FAResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.patch(`${TWO_FACTOR_ENDPOINT}/${providerId}`, { enabled: enable })
        return { success: true }
    } catch (error: any) {
        console.log("[toggle2FAProvider] status:", error?.response?.status)
        console.log("[toggle2FAProvider] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function changePassword(
    oldPassword: string,
    newPassword: string,
): Promise<ChangePasswordResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(CHANGE_PASSWORD_ENDPOINT, {
            old_password: oldPassword,
            new_password: newPassword,
        })
        return { success: true }
    } catch (error: any) {
        console.log("[changePassword] status:", error?.response?.status)
        console.log("[changePassword] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}