"use server"

import { CHANGE_PASSWORD_ENDPOINT, GET_TWO_FACTOR_ENDPOINT, UPDATE_TWO_FACTOR_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"

interface Get2FAResult {
    success:  boolean
    data?:    {
        "google": false,
        "facebook": true
    }
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
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_TWO_FACTOR_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                next: { tags: [CACHE_TAGS.TWO_FACTOR] },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data ?? json }

    } catch (error: any) {
        console.log("[get2FASettings] error:", error)
        return { success: false, message: "Failed to load 2FA settings." }
    }
}

export async function toggle2FAProvider(
    providerID: string,
    enable:     boolean,
): Promise<Toggle2FAResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.patch(UPDATE_TWO_FACTOR_ENDPOINT, { [providerID]: enable })
        revalidateTag(CACHE_TAGS.TWO_FACTOR, "max")
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
        // No revalidation needed — password change doesn't affect cached data
        return { success: true }
    } catch (error: any) {
        console.log("[changePassword] status:", error?.response?.status)
        console.log("[changePassword] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}