"use server"

import { CHANGE_PASSWORD_ENDPOINT, UPDATE_TWO_FACTOR_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"

interface Toggle2FAResult {
    success: boolean
    message?: string
}

interface ChangePasswordResult {
    success: boolean
    message?: string
}

export async function toggle2FAProvider(
    providerID: string,
    enable: boolean,
): Promise<Toggle2FAResult> {
    const axiosInstance = await getServerAxios()
    try {
        await axiosInstance.patch(UPDATE_TWO_FACTOR_ENDPOINT, { [providerID]: enable })
        revalidateTag(CACHE_TAGS.TWO_FACTOR, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function changePassword(
    oldPassword: string,
    newPassword: string,
): Promise<ChangePasswordResult> {
    const axiosInstance = await getServerAxios()
    try {
        await axiosInstance.post(CHANGE_PASSWORD_ENDPOINT, {
            old_password: oldPassword,
            new_password: newPassword,
        })
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}
