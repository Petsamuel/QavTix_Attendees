"use server"

import { GET_PROFILE_ENDPOINT, UPDATE_PROFILE_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"



interface ProfileResult {
    success:  boolean
    data?:    UserProfile
    message?: string
}

export async function getProfile(): Promise<ProfileResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(GET_PROFILE_ENDPOINT)
        const profile = data.data?.results?.[0] ?? data.data ?? data.results?.[0] ?? data
        return { success: true, data: profile }
    } catch (error: any) {
        console.log("[getProfile] status:", error?.response?.status)
        console.log("[getProfile] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<ProfileResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.patch(UPDATE_PROFILE_ENDPOINT, payload)
        const profile = data.data ?? data
        return { success: true, data: profile }
    } catch (error: any) {
        console.log("[updateProfile] status:", error?.response?.status)
        console.log("[updateProfile] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}