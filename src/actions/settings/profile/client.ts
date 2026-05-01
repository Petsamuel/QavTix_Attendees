"use server"

import { UPDATE_PROFILE_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"

interface ProfileResult {
    success:  boolean
    data?:    AuthUser
    message?: string
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<ProfileResult> {
    const axiosInstance = await getServerAxios()
    try {
        const { data } = await axiosInstance.patch(UPDATE_PROFILE_ENDPOINT, payload)
        revalidateTag(CACHE_TAGS.PROFILE, "max")
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}
