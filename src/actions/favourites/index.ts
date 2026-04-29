"use server"

import { cacheTag, revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { ADD_FAVOURITE_ENDPOINT, FAVOURITES_ENDPOINT, REMOVE_FAVOURITE_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { cookies } from "next/headers"

interface GetFavouritesParams {
    page?: number
    search?: string
    category?: string
    start_date?: string
    end_date?: string
    min_price?: string
    max_price?: string
}

interface GetFavouritesResult {
    success: boolean
    data?: PaginatedResponse<FavouriteEvent>
    message?: string
}

interface MutateFavouriteResult {
    success: boolean
    message?: string
}

export async function getFavourites(params: GetFavouritesParams = {}): Promise<GetFavouritesResult> {
    const accessToken = (await cookies()).get("access_token")?.value
    return _getFavourites(accessToken, params)
}

async function _getFavourites(
    accessToken: string | undefined,
    params: GetFavouritesParams,
): Promise<GetFavouritesResult> {
    "use cache"
    cacheTag(CACHE_TAGS.EVENT_CARDS)
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${FAVOURITES_ENDPOINT}`)
        Object.entries(params).forEach(([k, v]) => {
            if (v != null) url.searchParams.set(k, String(v))
        })

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }
    } catch {
        return { success: false, message: "Failed to load favourites." }
    }
}

export async function addFavourite(eventId: string | number): Promise<MutateFavouriteResult> {
    const axiosInstance = await getServerAxios()
    try {
        await axiosInstance.post(ADD_FAVOURITE_ENDPOINT, { event_id: eventId })
        revalidateTag(CACHE_TAGS.EVENT_CARDS, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function removeFavourite(eventId: string | number): Promise<MutateFavouriteResult> {
    const axiosInstance = await getServerAxios()
    try {
        const endpoint = REMOVE_FAVOURITE_ENDPOINT.replace("[event_id]", String(eventId))
        await axiosInstance.delete(endpoint)
        revalidateTag(CACHE_TAGS.EVENT_CARDS, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}