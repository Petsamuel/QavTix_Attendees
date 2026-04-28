"use server"

import { GET_PROFILE_ENDPOINT, UPDATE_PROFILE_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"

interface ProfileResult {
    success:  boolean
    data?:    AuthUser
    message?: string
}

export async function getProfile(): Promise<ProfileResult> {
    const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_PROFILE_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                next: { tags: [CACHE_TAGS.PROFILE], revalidate: 3600 },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        const profile = json.data?.results?.[0] ?? json.data ?? json.results?.[0] ?? json
        return { success: true, data: profile }

    } catch (error: any) {
        console.log("[getProfile] error:", error)
        return { success: false, message: "Failed to load profile." }
    }
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<ProfileResult> {
    const axiosInstance = await getServerAxios()
try {
        const { data } = await axiosInstance.patch(UPDATE_PROFILE_ENDPOINT, payload)
        revalidateTag(CACHE_TAGS.PROFILE, "max")
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        console.log("[updateProfile] status:", error?.response?.status)
        console.log("[updateProfile] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}