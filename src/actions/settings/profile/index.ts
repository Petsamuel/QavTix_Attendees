import { GET_PROFILE_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { cacheTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"

interface ProfileResult {
    success:  boolean
    data?:    AuthUser
    message?: string
}

export async function getProfile(token: string | undefined): Promise<ProfileResult> {
    'use cache'
    cacheTag(CACHE_TAGS.PROFILE)
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_PROFILE_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
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
        return { success: false, message: "Failed to load profile." }
    }
}